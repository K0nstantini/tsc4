import {Blockchain, SandboxContract} from '@ton-community/sandbox';
import {beginCell, BitString, Cell, Slice, toNano} from 'ton-core';
import {Task3} from '../wrappers/Task3';
import '@ton-community/test-utils';
import {compile} from '@ton-community/blueprint';
import {hex_to_ascii} from "./Task4.spec";

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
        // ============== 1 ===================================

        // let flag = 0b100000;
        // let value = 0b11111111;
        //
        // let binary_value = 3984398437374837;
        // let list = beginCell()
        //     .storeUint(binary_value, 52)
        //     .endCell();
        //
        // let res = await task3.getFindAndReplace(flag, value, list);
        // let ds = res.beginParse();
        // expect(ds.loadUint(56)).toEqual(63750508677749621);
        //
        // // ============== 2 ===================================
        //
        // flag = 0b10;
        //  value = 0b11101;
        //
        // binary_value = 4498584577343434;
        // list = beginCell()
        //     .storeUint(binary_value, 52)
        //     .endCell();
        //
        // res = await task3.getFindAndReplace(flag, value, list);
        // ds = res.beginParse();
        // expect(ds.loadUint(85)).toEqual(38676032225073898578766781);
        //
        // // ============== 3 ===================================
        //
        // flag = 0b1111111111;
        // value = 0b1000000001;
        //
        // list = beginCell()
        //     .storeUint(1, 1)
        //     .storeUint(0, 1018)
        //     .storeUint(15, 4)
        //     .storeRef(
        //         beginCell()
        //             .storeUint(63, 6)
        //             .storeUint(0, 135)
        //             .storeUint(1, 1)
        //             .endCell()
        //     )
        //     .endCell();
        //
        //
        // res = await task3.getFindAndReplace(flag, value, list);
        // ds = res.beginParse();
        // expect(ds.loadUint(1)).toEqual(1);
        // for (let n = 0; n < 15; n += 1) {
        //     expect(ds.loadUint(64)).toEqual(0);
        // }
        // expect(ds.loadUint(58)).toEqual(0);
        // expect(ds.loadUint(4)).toEqual(8);
        // ds = ds.loadRef().beginParse();
        // console.log(ds.remainingBits);
        // expect(ds.loadUint(6)).toEqual(1);
        // for (let n = 0; n < 2; n += 1) {
        //     expect(ds.loadUint(64)).toEqual(0);
        // }
        // expect(ds.loadUint(7)).toEqual(0);
        // expect(ds.loadUint(1)).toEqual(1);

        // ============== 4 ===================================

        // let ds = beginCell().endCell().beginParse();
        //
        // const checkComplexText = (s: string) => {
        //     const exp = hex_to_ascii(ds.loadBits(s.length * 8).toString());
        //     return expect(exp).toEqual(s);
        // };
        //
        // let flag = 0b011101010110111001100100 ;
        // // flag = 554553254658073180597860;
        // let value = 0b011000010110001001100011 ;
        //
        // let s = "Today, we are going to teach our prospective builders how to mine on TON Blockchain. " +
        //     "This experience will allow all of you to understand the significance of mining and why Bitcoin mining helped revolutionize the industry.";
        // let list = beginCell()
        //     .storeStringTail(s)
        //     .endCell();
        //
        // let res = await task3.getFindAndReplace(flag, value, list);
        // ds = res.beginParse();
        // checkComplexText("Today, we are going to teach our prospective builders how to mine on TON Blockchain. This experience will allow all of you to a");
        // ds = ds.loadRef().beginParse();
        // checkComplexText("bcerstand the significance of mining and why Bitcoin mining helped revolutionize the");

        // ============== 5 ===================================


        let flag = 0b101 ;
        let value = 0b111 ;

        const p = '011000010110001001100011';
        let list = new Cell({
            bits: new BitString(new Buffer(p, 'binary'), 0, p.length)
        });

        // let list = beginCell()
        //     .storeUint(BigInt(0xA78D25596F489D9549DB2E8270068A85DF1BDC5ADE28D6118B2D127B91C3BCC308151D3AC81BD3A5B24807101CAB3BF63198A51FDA261AD6344FDB59112E7C46), 512)
        //     .storeUint(BigInt(0x87A856616E4C0268CB77368D329C63D6B3E0E4DD2BC398696D44CC0DEC21FC7900E26F7DCF3976C3F039153E990F0B0FA6C67691DC5B4D843F7C63712E7C46), 504)
        //     .storeUint(0, 7)
        //     .endCell();


        // let s = list.beginParse().loadBits(p.length);
        console.log(list);

        let res = await task3.getFindAndReplace(flag, value, list);
        let ds = res.beginParse();
        expect(ds.loadUint(p.length)).toEqual(6414947);
        console.log(ds);
    });
});
