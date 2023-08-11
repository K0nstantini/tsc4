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

        let a = "For instance, users may indicate the purpose of a simple transfer from their wallet to the wallet of another user in this text field. On the other hand, if the comment begins with the byte 0xff, the remainder is a \"binary comment\", which should not be displayed to the end user as text (only as a hex dump if necessary). The intended use of \"binary comments\" is, e.g., to contain a purchase identifier for payments in a store, to be automatically generated and processed by the store's software.";
        res = await task4.getCaesarCipherEncrypt(3, simpleText(a));
        ds = res.beginParse();
        ds.skip(32);
        checkComplexText("Iru lqvwdqfh, xvhuv pdb lqglfdwh wkh sxusrvh ri d vlpsoh wudqvihu iurp wkhlu zdoohw wr wkh zdoohw ri dqrwkhu xvhu lq wklv w");
        let dc = ds.loadRef();
        ds = dc.beginParse();
        checkComplexText("haw ilhog. Rq wkh rwkhu kdqg, li wkh frpphqw ehjlqv zlwk wkh ebwh 0aii, wkh uhpdlqghu lv d \"elqdub frpphqw\", zklfk vkrxog qrw e");
         dc = ds.loadRef();
        ds = dc.beginParse();
        checkComplexText("h glvsodbhg wr wkh hqg xvhu dv whaw (rqob dv d kha gxps li qhfhvvdub). Wkh lqwhqghg xvh ri \"elqdub frpphqwv\" lv, h.j., wr frqwd");
        dc = ds.loadRef();
        ds = dc.beginParse();
        checkComplexText("lq d sxufkdvh lghqwlilhu iru sdbphqwv lq d vwruh, wr eh dxwrpdwlfdoob jhqhudwhg dqg surfhvvhg eb wkh vwruh'v vriwzduh.");
        expect(ds.remainingBits).toEqual(0);

        a = "FOR INSTANCE, USERS MAY INDICATE THE PURPOSE OF A SIMPLE TRANSFER";
        res = await task4.getCaesarCipherEncrypt(21, simpleText(a));
        ds = res.beginParse();
        ds.skip(32);
        checkComplexText("AJM DINOVIXZ, PNZMN HVT DIYDXVOZ OCZ KPMKJNZ JA V NDHKGZ OMVINAZM");
        expect(ds.remainingBits).toEqual(0);

        a = "For instance, users may indicate the purpOSE OF A SIMPLE TRANSFER FROM THEIR WALLet to the wallet of another user in this t";
        res = await task4.getCaesarCipherEncrypt(-7, simpleText(a));
        ds = res.beginParse();
        ds.skip(32);
        checkComplexText("Yhk bglmtgvx, nlxkl ftr bgwbvtmx max inkiHLX HY T LBFIEX MKTGLYXK YKHF MAXBK PTEExm mh max pteexm hy tghmaxk nlxk bg mabl m");
        expect(ds.remainingBits).toEqual(0);

        res = await task4.getCaesarCipherEncrypt(1, simpleText("?@[`{"));
        checkText("?@[`{");

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
        expect(ds.remainingBits).toEqual(0);

        a = "AJM DINOVIXZ, PNZMN HVT DIYDXVOZ OCZ KPMKJNZ JA V NDHKGZ OMVINAZM";
        res = await task4.getCaesarCipherDecrypt(21, simpleText(a));
        ds = res.beginParse();
        ds.skip(32);
        checkComplexText("FOR INSTANCE, USERS MAY INDICATE THE PURPOSE OF A SIMPLE TRANSFER");
        expect(ds.remainingBits).toEqual(0);

    });
});

export function hex_to_ascii(hex: string) {
    let str = '';
    for (let n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substring(n, n + 2), 16));
    }
    return str;
}