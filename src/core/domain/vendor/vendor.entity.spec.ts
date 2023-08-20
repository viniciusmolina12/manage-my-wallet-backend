import Vendor from "./vendor.entity";

describe('Vendor entity unit tests', () => {
    it('should throw if id is empty', () => {
        expect(() => {
            const vendor = new Vendor('', 'Vendor 1');
        }).toThrowError('Id is required');
    })
    it('should throw if name is empty', () => {
        expect(() => {
            const vendor = new Vendor('1', '');
        }).toThrowError('Name is required');
    })

    it('should change name', () => {
        const vendor = new Vendor('1', 'Vendor');
        expect(vendor.name).toBe('Vendor');
        vendor.changeName('Vendor 2');
        expect(vendor.name).toBe('Vendor 2')
    })

    it('should throw a error if new name is empty', () => {
        const vendor = new Vendor('1', 'Vendor');
        expect(() => {
            vendor.changeName('');
        }).toThrowError('Name is required')
    })

  
});