const cos = (reading) => {
  return Math.cos((reading * Math.PI) / 180);
};

const sin = (reading) => {
  return Math.sin((reading * Math.PI) / 180);
};

//a=yaw, B=pitch, y=roll
const getAcclerometerValues = (a, B, y) => {
  const gravitationalPull = [0, 0, 9.81];
  const rotationMatrix = [
    [
      cos(a) * cos(B),
      cos(a) * sin(B) * sin(y) - sin(a) * cos(y),
      cos(a) * sin(B) * cos(y) + sin(a) * sin(y),
    ],
    [
      sin(a) * cos(B),
      sin(a) * sin(B) * sin(y) + cos(a) * cos(y),
      cos(a) * sin(B) * sin(y) - cos(a) * sin(y),
    ],
    [-sin(B), cos(B) * sin(y), cos(B) * cos(y)],
  ];

  function multiply(mat1, mat2) {
    let res = [];
    let temp = 0;
    for (let i = 0; i < mat1.length; i++) {
      for (let j = 0; j < mat2.length; j++) {
        temp += mat1[i][j] * mat2[j];
      }
      res.push(Math.round(temp * 1000));
      temp = 0;
    }
    return res;
  }

  const acc = multiply(rotationMatrix, gravitationalPull);
  console.log(acc);
  return acc;
};

export {
    getAcclerometerValues
}


