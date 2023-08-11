import {Blockchain, SandboxContract} from '@ton-community/sandbox';
import {beginCell, BitString, Cell, toNano} from 'ton-core';
import {Task3} from '../wrappers/Task3';
import '@ton-community/test-utils';
import {compile} from '@ton-community/blueprint';

describe('Task3', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task3');
    });

    let blockchain: Blockchain;
    let task3: SandboxContract<Task3>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task3 = blockchain.openContract(Task3.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task3.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task3.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task3 are ready to use
    });

    it('should find and replace', async () => {
        let flag = 0b100000;
        let value = 0b11111111;

        let binary_value = 3984398437374837;
        let list = beginCell()
            .storeUint(binary_value, 52)
            .endCell();

        // let res = await task3.getFindAndReplace(flag, value, list);
        // let ds = res.beginParse();
        // expect(ds.loadUint(56)).toEqual(63750508677749621);

        flag = 0b1111111111;
        value = 0b1000000001;

        // let binary_value_big = BigInt("250561853410701596557444684673866657010220293093133512909600348450487082172792661286038994690695052461325699100153893054646104098222228073063766494782302722810120081291184627929537671974977349220810968318532927168872930418994518829420741149312204893572709752708607032818175191464000110584271035222302421964735705239567737021531617822196063138473836545");
        list = beginCell()
            .storeUint(1, 1)
            .storeUint(0, 1018)
            .storeUint(15, 4)
            .storeRef(
                beginCell()
                    .storeUint(63, 6)
                    .storeUint(0, 135)
                    .storeUint(1, 1)
                    .endCell()
            )
            .endCell();

        console.log(list);

        let res = await task3.getFindAndReplace(flag, value, list);
        console.log(res);
        let ds = res.beginParse();
        expect(ds.loadUint(1)).toEqual(1);
        for (let n = 0; n < 15; n += 1) {
            expect(ds.loadUint(64)).toEqual(0);
        }
        expect(ds.loadUint(58)).toEqual(0);
        expect(ds.loadUint(4)).toEqual(8);
        ds = ds.loadRef().beginParse();
        console.log(ds.remainingBits)
        expect(ds.loadUint(6)).toEqual(1);
        for (let n = 0; n < 2; n += 1) {
            expect(ds.loadUint(64)).toEqual(0);
        }
        expect(ds.loadUint(7)).toEqual(0);
        expect(ds.loadUint(1)).toEqual(1);
    });
});
