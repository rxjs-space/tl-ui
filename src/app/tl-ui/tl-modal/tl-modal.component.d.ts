import { OnInit } from '@angular/core';
import { TlModalModel, TlModalResult } from './tl-modal.interface';
import { TlModalConfigService } from './tl-modal-config.service';
export declare class TlModalComponent implements OnInit {
    private configService;
    modalModel: TlModalModel;
    constructor(configService: TlModalConfigService);
    ngOnInit(): void;
    onClose(modalResult: TlModalResult): void;
}
