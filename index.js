const fs = require('fs');
const superagent = require('superagent');

// ES6 bu özelliği destekliyor. Önceki sürümlerde yok !!!
// readFileProm fonksiyonu parametre olarak sadece "file"ı alıyor.
const readFileProm = (file) => {
  // resolve, reject yerine aslında istenilen şey yazılabilir ama bu isimler standard gibi
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      //burası parametre olarak alınan dog.txt dosyası bulunamazsa çalışacak. readFile'dan gelir.
      //konsolda (node:15628) UnhandledPromiseRejectionWarning: I could not find that file! gibi bir mesaj verir
      if (err) reject('I could not find that file!');
      //bu işlwv readFileProm'un çıktısı olarak düşünülebilir. then() işlevi için kullanılacak
      resolve(data);
    });
  });
};

const writeFileProm = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('Could not write file!');
      resolve('success'); //writeFile'dan geri dönen bir data yok o nednele text yazdıldı
    });
  });
};

// getDogPic asenkron bir fonksiyon olacak. Bu fonksiyonlar otomatik olarak "promise" döner.
// Bu tip fonksiyonların içinde en az bir tane "await" olmak zorundadır. "await" sadece async
// fonksiyonlarda kullanılabilir.
const getDogPic = async () => {
  // try - catch error handling için eklendi. çünkü aksi durumda "err" parametresine erişim olmayacağı
  // için error handling yapılamayacaktı. Bu durumda herhangi bir error olduğunda try {} kısmından
  // çıkılır ve catch kısmı çalışır.
  try {
    // await burada readFileProm promise'i sonuçlanana kadar kodu durdurur. Ama ana döngü devam eder.
    // await ifadesinin değeri burada promise'in resolve değeri olur.
    const data = await readFileProm(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    // aynı anda birden fazla promise çalıştırma
    const res1Prom = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Prom = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Prom = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([res1Prom, res2Prom, res3Prom]);
    const imgs = all.map((el) => el.body.message);
    console.log(imgs);

    await writeFileProm('dog-img.txt', imgs.join('\n'));
    console.log('Random dog image path saved to file!');
  } catch (err) {
    console.log('Error Massage: ' + err);

    // deneme 3 için eklendi
    throw err; // burası bu promise dönen fonksiyonun "rejected" olmasını sağlıyor
  }

  return '2: READY (DOG)';
};

/*
//--- Deneme 1 ---
console.log('1: Will get dog pics...');
const x = getDogPic(); // bu fonksiyon "await" yüzünden arka plana atılır ve devam edilir.

// işlem bitmediği için burada x'in ne olacağı belli değil.
// o nedenle konsola Promise { <pending> } gibi bir ifade yazılıyor.
console.log(x);
console.log('3: Done getting dog pics!');
*/
/*
//--- Deneme 2 ---
// burada txt dosyasının ismini değiştirip hata oluştursak bile console.log()'lar işleyecek.
// error durumunu .catch( err => {} ) ekleyerek de handle EDEMİYORUZ !!!
// nedeni getDogPic() fonksiyonunun başarılı bir şekilde geri dönmesinden kaynaklanıyor.
console.log('1: Will get dog pics...');
getDogPic().then((x) => {
  console.log(x);
  console.log('3: Done getting dog pics!');
}); //.catch( err => {} );
*/
/*
//--- Deneme 3 ---
// burada txt dosyasının ismini değiştirip hata oluştursak bile console.log()'lar işleyecek.
// error durumunu .catch( err => {} ) ekleyerek de handle EDEMİYORUZ !!!
// nedeni getDogPic() fonksiyonunun başarılı bir şekilde geri dönmesinden kaynaklanıyor.
// bunu çözmek için getDogPic() içinden hata fırlatmamız lazım (throw Error)
console.log('1: Will get dog pics...');
getDogPic()
  .then((x) => {
    console.log(x);
    console.log('3: Done getting dog pics!');
  })
  .catch((err) => {
    console.log('ERROR !!!');
  });
*/

//--- Deneme 4 ---
// deneme 3 buna çevrildi

// immediately envolved function expression (IFE)
// (async () => {
// buraya fonksiyonu tanımla
// })(); //(); kısmı fonksiyonu hemen çağır demek
(async () => {
  try {
    console.log('1: Will get dog pics...');
    const x = await getDogPic();
    console.log(x);
    console.log('3: Done getting dog pics!');
  } catch (err) {
    onsole.log('ERROR !!!');
  }
})();
