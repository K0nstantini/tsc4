import {Blockchain, printTransactionFees, SandboxContract} from '@ton-community/sandbox';
import {Cell, toNano} from 'ton-core';
import {Task5} from '../wrappers/Task5';
import '@ton-community/test-utils';
import {compile} from '@ton-community/blueprint';

describe('Task5', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task5');
    });

    let blockchain: Blockchain;
    let task5: SandboxContract<Task5>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task5 = blockchain.openContract(Task5.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task5.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task5.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task5 are ready to use
    });

    it('should fibonacci sequence', async () => {
        let res = await task5.getFibonacciSequence(1, 3);

        const checkEq = (n: number) => expect(res.readNumber()).toEqual(n);

        checkEq(1);
        checkEq(1);
        checkEq(2);
        expect(res.remaining).toEqual(0);

        res = await task5.getFibonacciSequence(201, 4);
        checkEq(453973694165307953197296969697410619233826);
        checkEq(734544867157818093234908902110449296423351);
        checkEq(1188518561323126046432205871807859915657177);
        checkEq(1923063428480944139667114773918309212080528);
        expect(res.remaining).toEqual(0);

        res = await task5.getFibonacciSequence(0, 3);
        checkEq(0);
        checkEq(1);
        checkEq(1);
        expect(res.remaining).toEqual(0);

        res = await task5.getFibonacciSequence(2, 1);
        checkEq(1);
        expect(res.remaining).toEqual(0);

        res = await task5.getFibonacciSequence(367, 4);
        checkEq(22334640661774067356412331900038009953045351020683823507202893507476314037053);
        checkEq(36138207717265885328441519836863123286695915870773021050058862406562749608741);
        checkEq(58472848379039952684853851736901133239741266891456844557261755914039063645794);
        checkEq(94611056096305838013295371573764256526437182762229865607320618320601813254535);
        expect(res.remaining).toEqual(0);

        res = await task5.getFibonacciSequence(370, 1);
        checkEq(94611056096305838013295371573764256526437182762229865607320618320601813254535);
        expect(res.remaining).toEqual(0);

        res = await task5.getFibonacciSequence(369, 2);
        checkEq(58472848379039952684853851736901133239741266891456844557261755914039063645794);
        checkEq(94611056096305838013295371573764256526437182762229865607320618320601813254535);
        expect(res.remaining).toEqual(0);

        res = await task5.getFibonacciSequence(116, 255);
        checkEq(781774079430987230203437);

    });
});
