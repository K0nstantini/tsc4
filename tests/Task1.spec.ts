import {Blockchain, SandboxContract} from '@ton-community/sandbox';
import {beginCell, Cell, toNano} from 'ton-core';
import {Task1} from '../wrappers/Task1';
import '@ton-community/test-utils';
import {compile} from '@ton-community/blueprint';

describe('Task1', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task1');
    });

    let blockchain: Blockchain;
    let task1: SandboxContract<Task1>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task1 = blockchain.openContract(Task1.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task1.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task1 are ready to use
    });

    // it('should find branch by hash', async () => {
    //     const hash = (cell: Cell) => BigInt('0x' + cell.hash().toString('hex'));
    //
    //     const targetCell1 = beginCell()
    //         .storeUint(10, 32)
    //         .endCell();
    //
    //     const targetCell2 = beginCell()
    //         .storeCoins(666)
    //         .endCell();
    //
    //     const targetCell3 = beginCell()
    //         .storeRef(targetCell1)
    //         .storeRef(targetCell2)
    //         .endCell();
    //
    //     const wrongTarget = beginCell()
    //         .storeUint(11, 32)
    //         .endCell();
    //
    //     const tree = beginCell()
    //         .storeRef(
    //             beginCell()
    //                 .storeCoins(1111)
    //                 .endCell()
    //         )
    //         .storeRef(targetCell3)
    //         .endCell();
    //
    //     let res = await task1.getFindBranchByHash(hash(targetCell1), tree);
    //     expect(res).toEqualCell(targetCell1);
    //
    //     res = await task1.getFindBranchByHash(hash(targetCell3), tree);
    //     expect(res).toEqualCell(targetCell3);
    //
    //     res = await task1.getFindBranchByHash(hash(wrongTarget), tree);
    //     expect(res).toEqualCell(beginCell().endCell());
    // });
});