import { describe, it, assert, test } from "vitest"

describe('first tests', () => {
    it('for', () => {
        assert.equal(Math.sqrt(4), 2)
    });
    it('hi', () => {
        let name = 'Dave'
        console.log('hi test')
        assert.equal(`name is ${name}`, 'name is Dave')
    });
})