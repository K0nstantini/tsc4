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

        let res = beginCell().endCell();
        let ds = res.beginParse();

        const checkText = (s: string) => {
            const ds = res.beginParse();
            ds.skip(32);
            expect(ds.loadStringTail()).toEqual(s);
        };

        const checkComplexText = (s: string) => {
            const exp = hex_to_ascii(ds.loadBits(s.length * 8).toString());
            return expect(exp).toEqual(s);
        };

        let a = "When comment is long enough that it doesn't fit in a cell, non-fitting end of the line is put to the first reference of the cell. This process continues recursively to describe comments that doesn't fit in two or more cells.";
        // console.log(simpleText(a));
        res = await task4.getCaesarCipherEncrypt(-25, simpleText(a));
        // console.log(res);
        ds = res.beginParse();
        ds.skip(32);
        checkComplexText("Xifo dpnnfou jt mpoh fopvhi uibu ju epfto'u gju jo b dfmm, opo-gjuujoh foe pg uif mjof jt qvu up uif gjstu sfgfsfodf pg uif");
        let dc = ds.loadRef();
        ds = dc.beginParse();
        checkComplexText(" dfmm. Uijt qspdftt dpoujovft sfdvstjwfmz up eftdsjcf dpnnfout uibu epfto'u gju jo uxp ps npsf dfmmt.");

        res = await task4.getCaesarCipherEncrypt(1, simpleText("12^|"));
        checkText("12^|");

        res = await task4.getCaesarCipherEncrypt(-79, simpleText("ABC"));
        checkText("ZAB");

        res = await task4.getCaesarCipherEncrypt(-79, simpleText(""));
        checkText("");


        // ======= DEC =======

        a = "Bmjs htrrjsy nx qtsl jstzlm ymfy ny itjxs'y kny ns f hjqq, sts-knyynsl jsi tk ymj qnsj nx uzy yt ymj knwxy wjkjwjshj tk ymj hjqq. Ymnx uwthjxx htsynszjx wjhzwxnajqd yt ijxhwngj htrrjsyx ymfy itjxs'y kny ns ybt tw rtwj hjqqx.";
        res = await task4.getCaesarCipherDecrypt(-21, simpleText(a));
        // console.log(res);
        ds = res.beginParse();
        ds.skip(32);
        checkComplexText("When comment is long enough that it doesn't fit in a cell, non-fitting end of the line is put to the first reference of the");
        dc = ds.loadRef();
        ds = dc.beginParse();
        checkComplexText(" cell. This process continues recursively to describe comments that doesn't fit in two or more cells.");

    });
});

export function hex_to_ascii(hex: string) {
    let str = '';
    for (let n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substring(n, n + 2), 16));
    }
    return str;
}