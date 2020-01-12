import { expect } from 'chai';

describe('bar', () => {
    it('sync function returns true', () => {
        expect(true).to.be.true;
    });

    it('async function returns true', async () => {
        expect(true).to.be.true;
    });
});