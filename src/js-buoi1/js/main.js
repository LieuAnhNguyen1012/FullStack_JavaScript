console.log("Hello world external");

let fullName = "Nguyen Thi Khach Hang"
let address = "15 Trần Khắc Trân"
console.log(fullName)
console.log(address)

let salary = 50
console.log(typeof salary)
console.log(typeof fullName)
console.log(typeof address)

console.log("--------Math Operator --------")

let num1 = 5
let num2 = 10
let num3 = 7
let numSum = num1 + num2
let numTimes = num1*num2

console.log("num1 + num2 = ", numSum)
console.log(`num1 * num2 = ${numTimes}`)
console.log(num1 + num2)
console.log(num3 / num2)
console.log(num3 % num2)

// let a = +prompt("Nhập số 1:")
// let b = +prompt("Nhập số 2:")
// let c = +prompt("Nhập số 3:")
// let d = +prompt("Nhập số 4:")
// let e = +prompt("Nhập số 5:")
// console.log("Average of 5 number is: ",(a+b+c+d+e)/5)

console.log("--------Tính lương nhân viên --------")
let luongNhanhVien = 1000000
let soNgayLam = prompt("Nhập số ngày làm: ")
let luongNV = 0

luongNV = soNgayLam*luongNhanhVien
console.log("Lương nhân viên là: ", luongNV)
alert("Lương nhân viên là:" + luongNV)