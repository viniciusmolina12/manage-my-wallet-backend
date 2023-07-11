import Category from "./category.entity";

describe('Category entity tests', () => {
    it('Should create a category', () => {
        const category = new Category('123', 'Category', 'Description');
        expect(category.id).toBe('123');
        expect(category.name).toBe('Category');
        expect(category.description).toBe('Description'); 
    })
    it('Should throw an error if id is missing', () => {
        expect(() => {
            const category = new Category('', 'Category', 'Description');
        }).toThrow('Id is required')
    })
    it('Should throw an error if name is missing', () => {
        expect(() => {
            const category = new Category('123', '', 'Description');
        }).toThrow('Name is required')
    })

})