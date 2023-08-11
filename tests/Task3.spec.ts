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


        let res = await task3.getFindAndReplace(flag, value, list);
        let ds = res.beginParse();
        expect(ds.loadBits(1016).toString()).toEqual("546FE461792C207F65206172652067EFE96E67207C6F207C65616368206FF5722070726FF37065637C697E6520627D696C6465727320686FF7207C6F206D696E65206FEE20544FCE20426C6FE36B636861696E2E205468697320657870657269656E6365207F696C6C20616C6C6FF720616C6C206FE620796FF5207C6F207D");
        expect(ds.loadUint(7)).toEqual(7);
        ds = ds.loadRef().beginParse();
        expect(ds.loadBits(1016).toString()).toEqual("CD6FF37C20736D61727C20636FEE7C7261637C732073686FF56C64206E6FF420706572666FF26D206E6FEE2D7C72697E69616C2061637C696FEE73206FF22072656A65637C207C686520696E626FF56E64206D6573736167E5206FEE2072656365697E696E672061202273696D706C65207C72616E73666572206D65737361");
        expect(ds.loadUint(7)).toEqual(7);
        ds = ds.loadRef().beginParse();
        expect(ds.loadBits(232).toString()).toEqual("C96E206FF2646572207C6F2061636869657E65207C6869732067EFE16C");
        expect(ds.remainingBits).toEqual(0);

        flag = 0b10;
        value = 0b1;

        res = await task3.getFindAndReplace(flag, value, list);
        ds = res.beginParse();
        expect(ds.loadBits(1016).toString()).toEqual("73FD31F5C41FED063D6D06FFF7EDD079FA0F378E7C20FFFD20E1D7FDF0DE7E77EDA0CBFDF34DF5DA0E3FFD079FA0FF7EDA0FFE41CBEE41179FE7FCF8C7BF3C839C77B41BF1C37D777F67B41FF7CF1063E79FFE831F3C41FEC83DFFE83CFD07C7BFFDF883BFE3D78833FFEF3AC73F3B41DF1FFFCD107DFF88386FADBFEBE83E");
        expect(ds.loadUint(7)).toEqual(127);
        ds = ds.loadRef().beginParse();
        expect(ds.loadBits(672).toString()).toEqual("F3FCEBBF771F10639F9DFFEED07FD20EB7EDE7E20F38DA0EFD97FFFB441FDF7DE3BED07FF20EB79EFBF77EDD062812EFBFE1E6D079D63F77B6FA41FDF7DE23D7E41FF5A6FA41E7E831CF8EEFEDA0F38EF6837FF1");
        expect(ds.loadUint(5)).toEqual(30);
        expect(ds.remainingBits).toEqual(0);

        flag = 0b110;
        value = 0b1110111;

        res = await task3.getFindAndReplace(flag, value, list);
        ds = res.beginParse();
        expect(ds.loadBits(1016).toString()).toEqual("5477FBF747717DD2EE207BFBF75207717BA77520777BF7FBF7977F7777BA07BC77FBA07BC775771773BF782077FBFBD7BA207B87BA77FBFBBBFB8775773BFBC7797BF7775207727BD77977EE7747757BA7BBBA077877FBFBFBA07BC77FBA077EF77977F77752077FBF7F720544FBCF7204277EE77FBF73BF7BBF73BF787717");
        expect(ds.loadUint(7)).toEqual(60);
        ds = ds.loadRef().beginParse();
        expect(ds.loadBits(1016).toString()).toEqual("BBFB97B902A3BC3BCBDDDD03BABEE3DC3BABDD3BCBBABBFBBB9DFBA903DFDFBCBBF73BF7103B8BBF73BF73BFDFDFDD03B8BBF73BF7103BFDFBBB903EEBBFDFDE903DE3BFDD03DE87BCEF77FBFBBBFBC207BBBF7EF7717BA7BC20773BF7FBF7F77BC7BA771773BFBC7BBBA07BBBF7877FBFBD77EE7742077F777FBFBC207B87");
        expect(ds.loadUint(7)).toEqual(58);
        ds = ds.loadRef().beginParse();
        expect(ds.loadBits(1016).toString()).toEqual("BDD3BBBBBFDFDD3BF7903BFBBBFDFBFB977BDE3DD3BCBDFBBBCBB8BBF7103B8BB9DFDE3BCBBFDFBFBBDDDD03BFDFDD103DD3BABBD3BABB9DFDE103DE3BC3BA903BCBBFBBB93BFDFDEBBFBBBA103BF7BBABDDDFDDDFB8BBBDFBA903BFDFBFB903DD3BABB9DFBABBCBDFBBBCBBFBBBBDD03B890113DDDFBCBBF7BDC3BF73BA90");
        expect(ds.loadUint(7)).toEqual(30);
        ds = ds.loadRef().beginParse();
        expect(ds.loadBits(552).toString()).toEqual("F1EE9DC5DFDDEEEFDDDDDD5EE881DFBDDD5EEEFEEEFDC43DE4BBFB903BFDFDD3BA3BABDD103DE3BFDD03B8BB9DFBC3BCBBABDFBBBA903DE3BC3BCBDDDD03BBDFBFDFB8BBF7");
        expect(ds.loadUint(1)).toEqual(0);
        expect(ds.remainingBits).toEqual(0);
    });
});
