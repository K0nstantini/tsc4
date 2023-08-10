import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode, TupleItemCell,
    TupleItemInt
} from 'ton-core';

export type Task3Config = {};

export function task3ConfigToCell(config: Task3Config): Cell {
    return beginCell().endCell();
}

export class Task3 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Task3(address);
    }

    static createFromConfig(config: Task3Config, code: Cell, workchain = 0) {
        const data = task3ConfigToCell(config);
        const init = { code, data };
        return new Task3(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getFindAndReplace(provider: ContractProvider, flag: number, value: number, list: Cell) {
        const param1 = {
            type: 'int',
            value: BigInt(flag)
        } as TupleItemInt;

        const param2 = {
            type: 'int',
            value: BigInt(value)
        } as TupleItemInt;

        const param3 = {
            type: 'cell',
            cell: list,
        } as TupleItemCell;

        const {stack} = await provider.get('find_and_replace', [param1, param2, param3]);
        return stack.readCell();
    }
}
