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

        checkText("yzA");

        // res = await task4.getCaesarCipherEncrypt(-1, simpleText("ABC"));
        // checkText("zAB");


        res = await task4.getCaesarCipherEncrypt(1, complexText("xyz", "abc", "ABC"));
        let ds = res.beginParse();
        ds.skip(32);

        const checkComplexText = (s: string) => {
            const exp = hex_to_ascii(ds.loadBits(s.length * 8).toString());
            return expect(exp).toEqual(s);
        };

        checkComplexText("yzA");
        let dc = ds.loadRef();
        ds = dc.beginParse();
        checkComplexText("bcd");
        dc = ds.loadRef();
        ds = dc.beginParse();
        checkComplexText("BCD");

        res = await task4.getCaesarCipherEncrypt(1, simpleText("YZa"));
        checkText("Zab");


        res = await task4.getCaesarCipherDecrypt(1, simpleText("yzA"));
        checkText("xyz");

        res = await task4.getCaesarCipherDecrypt(1, simpleText("Zab"));
        checkText("YZa");

    });
});

function hex_to_ascii(hex: string) {
    let str = '';
    for (let n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substring(n, n + 2), 16));
    }
    return str;
}