import {Blockchain, SandboxContract} from '@ton-community/sandbox';
import {beginCell, Cell, toNano} from 'ton-core';
import {Task4} from '../wrappers/Task4';
import '@ton-community/test-utils';
import {compile} from '@ton-community/blueprint';

describe('Task4', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task4');
    });

    let blockchain: Blockchain;
    let task4: SandboxContract<Task4>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task4 = blockchain.openContract(Task4.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task4.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task4.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task4 are ready to use
    });

    it('should caesar cipher encrypt/decrypt', async () => {
        const simpleText = (s: string) => {
            return beginCell()
                .storeUint(0, 32)
                .storeStringTail(s)
                .endCell()
        };

        const complexText = (s1: string, s2: string, s3: string) => {
            return beginCell()
                .storeUint(0, 32)
                .storeStringTail(s1)
                .storeRef(
                    beginCell()
                        .storeStringTail(s2)
                        .storeRef(
                            beginCell()
                                .storeStringTail(s3)
                                .endCell()
                        )
                        .endCell()
                )
                .endCell()
        };

        let res = await task4.getCaesarCipherEncrypt(1, simpleText("xyz"));

        const checkText = (s: string) => {
            const ds = res.beginParse();
            ds.skip(32);
            expect(ds.loadStringTail()).toEqual(s);
        };


        checkText("yza");

        res = await task4.getCaesarCipherEncrypt(1, complexText("xyz", "abc", "ABC"));
        // console.log(res);
        let ds = res.beginParse();
        ds.skip(32);

        const checkComplexText = (s: string) => {
            const exp = hex_to_ascii(ds.loadBits(s.length * 8).toString());
            return expect(exp).toEqual(s);
        };

        checkComplexText("yza");
        let dc = ds.loadRef();
        ds = dc.beginParse();
        checkComplexText("bcd");
        dc = ds.loadRef();
        ds = dc.beginParse();
        checkComplexText("BCD");

        const a = "When comment is long enough that it doesn't fit in a cell, non-fitting end of the line is put to the first reference of the cell. This process continues recursively to describe comments that doesn't fit in two or more cells.";
        // console.log(simpleText(a));
        res = await task4.getCaesarCipherEncrypt(1, simpleText(a));
        // console.log(res);
        ds = res.beginParse();
        ds.skip(32);
        checkComplexText("Xifo dpnnfou jt mpoh fopvhi uibu ju epfto'u gju jo b dfmm, opo-gjuujoh foe pg uif mjof jt qvu up uif gjstu sfgfsfodf pg uif");
         dc = ds.loadRef();
        ds = dc.beginParse();
        checkComplexText(" dfmm. Uijt qspdftt dpoujovft sfdvstjwfmz up eftdsjcf dpnnfout uibu epfto'u gju jo uxp ps npsf dfmmt.");

        res = await task4.getCaesarCipherEncrypt(1, simpleText("YZa"));
        checkText("ZAb");

        res = await task4.getCaesarCipherEncrypt(1, simpleText("12^|"));
        checkText("12^|");

        res = await task4.getCaesarCipherEncrypt(- 79, simpleText("ABC"));
        checkText("ZAB");

        // ======= DEC =======

        res = await task4.getCaesarCipherDecrypt(1, simpleText("yzA"));
        checkText("xyZ");

        res = await task4.getCaesarCipherDecrypt(1, simpleText("Zab"));
        checkText("Yza");

    });
});

function hex_to_ascii(hex: string) {
    let str = '';
    for (let n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substring(n, n + 2), 16));
    }
    return str;
}