const arr = []
const arrOfObj = [{}]
const arrOfStr = ["", ""]

const cars = ["BMW", "Mercedes", "Ferrari"]
console.log('mobil yeu :', cars.push("Redbull"))

const carsIdxOf2 = cars[2]
console.log('mobil di index ke 2 :', carsIdxOf2);

const changeArrIdx1 = cars[1] = "You"
console.log('ganti isi index kesatu', cars);

const arrPopCars = cars.pop();
console.log('hilang paling akhir', cars);

const arrUseNew = new Array("You", "Yeu", "Yau")
console.log('array pakai new', arrUseNew)