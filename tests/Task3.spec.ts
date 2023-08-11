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


        let flag = 0b11101;
        let value = 0b11111;

        // const p = '011000010110001001100011';
        // let list = new Cell({
        //     bits: new BitString(new Buffer(p, 'binary'), 0, p.length)
        // });

        let list = beginCell()
            .storeStringTail("Today, we are going to teach our prospective builders how to mine on TON Blockchain. This experience will allow all of you to u")
            .storeUint(7, 7)
            .storeRef(beginCell()
                .storeStringTail("Most smart contracts should not perform non-trivial actions or reject the inbound message on receiving a \"simple transfer messa")
                .storeUint(7, 7)
                .storeRef(
                    beginCell()
                        .storeStringTail("In order to achieve this goal")
                        .endCell()
                )
                .endCell()
            )
            .endCell();

        // let ds = list.beginParse();
        // console.log(ds.loadBits(1016).toString());
        // console.log(getHex(ds));
        // ds = ds.loadRef().beginParse();
        // console.log(getHex(ds));
        // ds = ds.loadRef().beginParse();
        // console.log(getHex(ds));


        let res = await task3.getFindAndReplace(flag, value, list);
        let ds = res.beginParse();
        expect(ds.loadBits(1016).toString()).toEqual("546FE461792C207F65206172652067EFE96E67207C6F207C65616368206FF5722070726FF37065637C697E6520627D696C6465727320686FF7207C6F206D696E65206FEE20544FCE20426C6FE36B636861696E2E205468697320657870657269656E6365207F696C6C20616C6C6FF720616C6C206FE620796FF5207C6F207D");
        expect(ds.loadUint(7)).toEqual(7);
        ds = ds.loadRef().beginParse();
        expect(ds.loadBits(1016).toString()).toEqual("CD6FF37C20736D61727C20636FEE7C7261637C732073686FF56C64206E6FF420706572666FF26D206E6FEE2D7C72697E69616C2061637C696FEE73206FF22072656A65637C207C686520696E626FF56E64206D6573736167E5206FEE2072656365697E696E672061202273696D706C65207C72616E73666572206D65737361");
        expect(ds.loadUint(7)).toEqual(7);
        ds = ds.loadRef().beginParse();
        expect(ds.loadBits(232).toString()).toEqual("C96E206FF2646572207C6F2061636869657E65207C6869732067EFE16C");
    });
});

function getHex(ds: Slice) {
    let str = '';
    while (ds.remainingBits >= 8) {
        str += String.fromCharCode(parseInt(ds.loadBits(8).toString(), 16));
    }
    return str;
}