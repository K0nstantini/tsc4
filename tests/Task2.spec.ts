import {Blockchain, SandboxContract} from '@ton-community/sandbox';
import {Cell, toNano, Tuple, TupleItem, TupleItemInt} from 'ton-core';
import {Task2} from '../wrappers/Task2';
import '@ton-community/test-utils';
import {compile} from '@ton-community/blueprint';

describe('Task2', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task2');
    });

    let blockchain: Blockchain;
    let task2: SandboxContract<Task2>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task2 = blockchain.openContract(Task2.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task2.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task2.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task2 are ready to use
    });

    // it('should matrix multiplier', async () => {
    //
    //     const el = (n: number) => {
    //         return {
    //             type: "int",
    //             value: BigInt(n)
    //         } as TupleItemInt;
    //     };
    //
    //     const tuple = (items: TupleItem[]) => {
    //         return {
    //             type: "tuple",
    //             items
    //         } as Tuple;
    //     };
    //
    //     const row = (nums: number[]) => {
    //         return tuple(nums.map(el));
    //     };
    //
    //     let m1 = tuple([row([1, 2]), row([3, 4])]);
    //     let m2 = tuple([row([5, 6]), row([7, 8])]);
    //
    //     let res = await task2.getMatrixMultiplier(m1, m2);
    //     let mRow = res.readTuple();
    //     const checkEq = (n: number) => expect(mRow.readNumber()).toEqual(n);
    //
    //     checkEq(19);
    //     checkEq(22);
    //     mRow = res.readTuple();
    //     checkEq(43);
    //     checkEq(50);
    //
    //     m1 = tuple([row([1, 2, 2]), row([3, 1, 1])]);
    //     m2 = tuple([row([4, 2]), row([3, 1]), row([1, 5])]);
    //
    //     res = await task2.getMatrixMultiplier(m1, m2);
    //     mRow = res.readTuple();
    //
    //     checkEq(12);
    //     checkEq(14);
    //     mRow = res.readTuple();
    //     checkEq(16);
    //     checkEq(12);
    //
    //     m1 = tuple([row([4, 2]), row([3, 1]), row([1, 5])]);
    //     m2 = tuple([row([1, 2, 2]), row([3, 1, 1])]);
    //
    //     res = await task2.getMatrixMultiplier(m1, m2);
    //     mRow = res.readTuple();
    //
    //     checkEq(10);
    //     checkEq(10);
    //     checkEq(10);
    //     mRow = res.readTuple();
    //     checkEq(6);
    //     checkEq(7);
    //     checkEq(7);
    //     mRow = res.readTuple();
    //     checkEq(16);
    //     checkEq(7);
    //     checkEq(7);
    //
    // });
});
