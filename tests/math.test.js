const {calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add} = require("../src/math")

test('Should calculate total with tip', () => {
    const total = calculateTip(10, .3)

    expect(total).toBe(13)
})

test('Should calculate total with default tip', () => {
    const total = calculateTip(10)

    expect(total).toBe(12.5)
})

test('Should convert 32 F to 0 C', () => {
    const temp = fahrenheitToCelsius(32)
    expect(temp).toBe(0)
})

test('Should convert 0 F to 32 C', () => {
    const temp = celsiusToFahrenheit(0)
    expect(temp).toBe(32)
})

test('Should add two numbers', (done) => {
    add(2, 3).then((sum) => {
        expect(sum).toBe(5)
        done()
    })
})

test('Should add two numers async/await', async (done) => {
    const sum = await add(10, 32)
    expect(sum).toBe(42)
    done()
})