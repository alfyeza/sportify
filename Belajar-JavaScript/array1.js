const fruits = ["Banana", "Orange", "Apple", "Mango"];
console.log("ini buah: ", fruits)

const cars = ["BMW", "Ferrari", "Toyota"];
console.log('mobil yeu :', cars.push("RedBull"))

const arrPopCars = cars.pop()
console.log('hilang paling akhir ', cars);

const carsIdxOf2 = cars[1]
console.log('mobil di index ke 1 :', carsIdxOf2);

const changeArrIdx1 = cars[1] = "You"
console.log('ganti isi index kesatu', cars);
