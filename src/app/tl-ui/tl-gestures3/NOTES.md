# 应用 RxJS 来组织鼠标或触摸事件的 start, move 与 end

> 变量命名约定：
  - Observable 变量以 `Rx` 结尾，如 `endEventRx`；
  - Subject 变量以 `Rxx` 结尾，如 `startEventRxx`；
  - Subscription 变量以 `_` 结尾，如 `sme_`。

## 提出问题
在浏览器中如何实现对 gesture 事件的支持呢？（这并非本篇要探讨的问题。）比如 pan, swipe, pinch, rotate 等等。  
`@angular/material` [使用了 HammerJS][1]。[Try HammerJS out here][2].  
如果尝试自行实现 gesture 事件，在使用 RxJS 的情况下，我的大概思路如下：  
- 鼠标指针、一个触摸点都被认为是一个 singlePointer。依据一个或多个 singlePointer 的历史事件来判断某个 gestures 事件是否发生。比如：“mousedown 然后 mousemove 然后 mouseup”，这样一个组合（可能）会触发 swipe 事件。所以，我们需要（下一条）
- 跟踪某个 singlePointer 从 start 到 end 的事件组合。以鼠标事件为例，在不同的事件发生时，拿到相应的事件组合对象，具体如下：  
  |事件|对象|
  |---|---|
  |mousedown|`{startEvent: sDetails, moveEvent: null, endEvent: null}`|
  |mousemove|`{startEvent: sDetails, moveEvent: mDetails, endEvent: null}`|
  |mousedown|`{startEvent: sDetails, moveEvent: mDetails || null, endEvent: eDetails}`|  
  简单起见，我称这个事件组合为 SME，即 start + move + end。
  
那么，问题来了，该怎样得到 SME 对象呢？

## 分析问题
继续以鼠标事件为例。
----- 分析问题第一阶段 -----
假设我们的事件流是“mousedown 然后 mousemove 然后 mouseup”，那么我们得到3个 SME，分别是：
- sme0: `{s: sDetails, m: null, e: null}`
- sme1: `{s: sDetails, m: mDetails, e: null}`
- sme2: `{s: sDetails, m: mDetails, e: eDetails}`

我们来从后往前看：  
要得到 sme2，我们需要两个要素：
- 首先是 sme1，就是 sme2 之前的 SME。通过修改 sme1 来得到 sme2，这里就要用到 `scan` operator；
- 如何修改 sme1 呢？需要一个 `mouseup` 事件，并且是有定语的 `mouseup`，用一个 Object 来表达，即：  
  ```typescript
    {定语: 最近的 mousedown，事件: mouseup}
  ```
  改一下 property 名字，就是 `{startEvent: 最近的 mousedownDetails，nonStartEvent: mouseupDetails}`

同理，要得到 sme1，我们需要两个要素：sme0 与 `{startEvent: 最近的 mousedownDetails，nonStartEvent: mousemoveDetails}`。  
而要得到 sme0，我们只需要一个 `mousedown` 事件即可，统一起见，用 Object 表达，`{startEvent: 最近的 mousedownDetails，nonStartEvent: null}`。

----- 分析问题第二阶段 -----
我把 `{startEvent: ...，nonStartEvent: ...}`叫做 `startNonStartEventCombo`。根据上面的事件流，我们拿到 3个 combo：
- snc0: `{startEvent: 最近的 mousedownDetails，nonStartEvent: null}`
- snc1: `{startEvent: 最近的 mousedownDetails，nonStartEvent: mousemoveDetails}`
- snc2: `{startEvent: 最近的 mousedownDetails，nonStartEvent: mouseupDetails}`

----- 分析问题第三阶段 -----
很明显 SNC 流是 startEvent 流与 nonStartEvent 流组合得来的，这个组合，因为有主从关系，是多维组合，所以要用到 `mergeMap` operator，或者 `switchMap` operator。  
在决定用哪个 operator 之前，先看 nonStartEvent 流是怎么来的。
- ns0: `null`
- ns1: `mousemoveDetails`
- ns2: `mouseupDetails`

----- 解决第三阶段 -----
nonStartEvent 流是由 `null`、`mousemove` 事件、`mouseup` 事件组合而来，是一维组合，所以用到 `merge` operator。写出来是这样的：  
```typescript
const nonStartEventRx = moveEventRx
  .takeUntil(endEventRx)
  .merge(endEventRx.take(1))
  .startWith(null);
```
这里又出现了几个 operator，其名称已经说明了各自的功能。用自然语言把这个 Observable 表达出来就是：`null` 是它的第一个 notification，其后，每个 `mousemove` 会触发一个 notification，直到 `mouseup`，并且第一个 `mouseup`会作为这个 Observable 的最后一个 notification。
（两处用到了 endEventRx，即 subscribe 了两遍，也即运行了两个相同的 addEventListener。暂时我还不知道该如何优化。 ）

----- 解决第二阶段 -----
接下来，把 startEvent 流与 nonStartEventRx 组合起来，到底用 `switchMap` 呢还是 `mergeMap` 呢？  
`switchMap` 的意思是：在触发（subscribe）新的支流时，取消（unsubscribe）上一个支流；而`mergeMap`在出发新的支流的时候不会取消前一个支流。  
如果只针对 MouseEvent，两个 operator 的使用效果没有区别，因为在每个 `mousedown` （不包含 js 载入之后的第一个 `mousedown`）之前，一定有一个 `mouseup`来终结前一个支流。  
如果是 TouchEvent 呢？在食指的 touchstart 之后，发生了中指的 touchstart，很明显，我们不能即刻取消食指 touchstart 触发的支流。所以，这里用到的 operator 是 `mergeMap`（当然，针对 TouchEvent 的 nonStartEventRx 要稍微复杂，需要 filter by identifier）。于是：  
```typescript
const startNonStartEventComboRx = startEventRx
  .mergeMap(startEvent => nonStartEventRx, (startEvent, nonStartEvent) => ({
    startEvent, nonStartEvent
  }))
```

----- 解决第一阶段 -----
然后 scan startNonStartEventComboRx，就能得到 smeRx 了。
```typescript
const smeRx = startNonStartEventComboRx
  .scan((acc, curr) => {
    let newSME;
    switch (true) {
      case curr.nonStartEvent === null: // fresh start
        newSME = {s: curr.startEvent, m: null, e: null};
        break;
      case curr.nonStartEvent.type.search(/move/) > -1: // a move event
        newSME = Object.assign({}, acc, {m: curr.nonStartEvent});
        break;
      default: // a end event
        newSME = Object.assign({}, acc, {e: curr.nonStartEvent});
    }
  }, null) // null is the init sme
```

----- 解决第零阶段 -----
上面用到的 `startEventRx`、`moveEventRx`、`endEventRx`分别长什么样呢？
```typescript
const startEventRx: Observable<Event> = Observable.fromEvent(theElement, 'mousedown');
const moveEventRx: Observable<Event> = Observable.fromEvent(document, 'mousemove');
const endEventRx: Observable<Event> = Observable.fromEvent(document, 'mouseup');
```
我们在 theElement 上监听 `mousedown`，在 `document` 上监听 `mousemove` 与 `mouseup`。比如 swipe 事件，如果不在 `document` 上监听 `mousemove` 与 `mouseup`，会发生什么呢？

## 代码编写
就是把上面的代码从后往前堆起来。当然，要加入对 TouchEvent （还有 PointerEvent）的支持，事情会变得稍微复杂。这里是 [plnkr](3)。

## 结语
- 在对多重事件进行监听的时候，推荐使用 RxJS。
- 如果是事件的一维组合，使用 `merge` operator。
- 如果是事件的多维组合，使用 `mergeMap`、`switchMap` 等 operator。
- 如果依据上一个 notification 来生成当前 notification，使用 `scan` opoperator。

就这。

## 继续
本文要说的已经说完，下面是我在自行实现 gesture 事件过程中的一些进一步思考。
在 SME 中，还会有一个 P，即 press 事件，用到 Observable.interval，但这里没有 event.target，只能叫 possiblePressEvent，还要其他信息来确定是否是 press event。
有了 possiblePress 或者 press，SME 就变成了 SMPE。

每种 gesture 事件对应的历史事件是什么样的呢？
- tap: startEvent 然后 endEvent，且 `startEvent.target === endEvent.target`；
- shorttap: (这个事件是 dbltap 的准备事件) startEvent 然后 endEvent，且 `startEvent.target === endEvent.target`，且 `endEvent.time - startEvent.time <= shorttapIntervalThreshold`；
- dbltap：shorttap 事件之前有另一个 shorttap 事件，且 `shorttapCurr.time - shorttapPrev.time <= dbltapIntervalThreshold`；
- pan: startEvent 然后 moveEvent；
- swipe: startEvet 然后 moveEvent 然后 endEvent，且 `moveOffset >= swipeMoveOffsetThreshold`
- press: startEvent 然后 possiblePressEvent，且 a) possiblePressEvent 前面没有 moveEvent 或者 b) possiblePrssEvent 前面如果有 moveEvent，要求 `moveEvent.target === startEvent.target`；
- pinch: 至少有两个 activeTouch（有 touchstart, 尚未 touchend），并且两个 activeTouch 的距离发生变化。
- rotate: 至少有两个 activeTouch（有 touchstart, 尚未 touchend），并且两个 activeTouch 的连线发生了角度变化。

一个 SMPE 只是一个 pointer 的事件历史，很明显我们需要知道每个 identifier （鼠标的 identifier 人为指定为 -1）对应的 SMPE，即一个 `Map<identifier, SMPE>`。  
而且需要记载最后一个事件对应的 identifier。  
而且需要 activeTouch 对应的 identifier 的列表，而且需要 curr 列表，和 prev 列表，主要是要知道列表的前两位是否发生了变化。
而且需要计算 singlePointerData，来帮助决定 dbltap、swipe。  
而且需要计算 twoPointerData，来帮助决定 pinch、rotate。
所以就有了下面这个 interface。

```typescript
export interface SMPEData {
  smpeMap: Map<number, SMPE>;
  latestIdentifier: number;
  activeTouchIdentifiers: {
    prev: number[];
    curr: number[];
  };
  singlePointerData: SinglePointerData;
  twoPointerData: TwoPointerData;
}
```

按照这个思路，我做出了一个 angular directive 用来添加 gesture 时间，代码很长，相当长，所以，我觉得这个思路可能有问题...

[1]: https://github.com/angular/material2/blob/master/guides/getting-started.md#additional-setup-for-gestures
[2]: http://hammerjs.github.io/#try-it
[3]: https://plnkr.co/edit/RrZTUovEBVWZKsMiC4qv?p=preview