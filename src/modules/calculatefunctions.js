import { DA, HRA } from './constants';
import bcrypt from 'react-native-bcrypt';
import isaac from 'isaac';
import { Alert } from 'react-native';
import { showToast } from './Toaster';
bcrypt.setRandomFallback(len => {
  const buf = new Uint8Array(len);

  return buf.map(() => Math.floor(isaac.random() * 256));
});
export const comparePassword = (userPassword, serverPassword) => {
  let match = bcrypt.compareSync(userPassword, serverPassword);

  return match;
};
export const encryptPassword = async password =>
  await bcrypt.hashSync(password, 10);
export function round2dec(value) {
  if (value % 1 !== 0) {
    return parseFloat(
      Number(Math.round(value + 'e' + 2) + 'e-' + 2).toFixed(2),
    );
  } else {
    return value;
  }
}

export function NumInWords(number) {
  const first = [
    '',
    'one ',
    'two ',
    'three ',
    'four ',
    'five ',
    'six ',
    'seven ',
    'eight ',
    'nine ',
    'ten ',
    'eleven ',
    'twelve ',
    'thirteen ',
    'fourteen ',
    'fifteen ',
    'sixteen ',
    'seventeen ',
    'eighteen ',
    'nineteen ',
  ];
  const tens = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];
  const mad = ['', 'thousand', 'million', 'billion', 'trillion'];
  let word = '';

  for (let i = 0; i < mad.length; i++) {
    let tempNumber = number % (100 * Math.pow(1000, i));
    if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
      if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
        word = titleCase(
          first[Math.floor(tempNumber / Math.pow(1000, i))] +
            mad[i] +
            ' ' +
            word,
        );
      } else {
        word = titleCase(
          tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] +
            ' ' +
            first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] +
            mad[i] +
            ' ' +
            word,
        );
      }
    }

    tempNumber = number % Math.pow(1000, i + 1);
    if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
      word = titleCase(
        first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] +
          'hunderd ' +
          word,
      );
  }
  return word;
}

export function titleCase(str) {
  if (str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  } else {
    return '';
  }
}

export function percentTotal(value) {
  if (value >= 90) {
    return 'A+';
  } else if (value >= 80) {
    return 'A';
  } else if (value >= 70) {
    return 'B+';
  } else if (value >= 60) {
    return 'B';
  } else if (value >= 45) {
    return 'C+';
  } else if (value >= 25) {
    return 'C';
  } else {
    return 'D';
  }
}

export const ptaxCalc = gross => {
  if (gross > 40000) {
    return 200;
  } else if (gross > 25000) {
    return 150;
  } else if (gross > 15000) {
    return 130;
  } else if (gross > 10000) {
    return 110;
  } else {
    return 0;
  }
};
export function differenceInDays(startDate, endDate) {
  let start = new Date(startDate);
  let end = new Date(endDate);
  const diff = end - start;
  const seconds = (end.getTime() - start.getTime()) / 86400000;
  return seconds;
}
export const getDay = text => {
  let date = new Date(text);
  let day = date.getDate();
  return ordinal_suffix_of(day);
};
export const getFullYear = text => {
  let date = new Date(text);

  let year = date.getFullYear();
  return year;
};
export function ordinal_suffix_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return i + 'st';
  }
  if (j === 2 && k !== 12) {
    return i + 'nd';
  }
  if (j === 3 && k !== 13) {
    return i + 'rd';
  }
  return i + 'th';
}
export const getMonthName = date => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const d = new Date(date);
  return monthNames[d.getMonth()];
};

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const shortMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
export const finMonths = [
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
  'January',
  'February',
  'March',
];
export const getMonthDays = [31, 30, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function GetMonthName(monthNumber) {
  monthNumber = monthNumber < 0 ? 11 : monthNumber;
  var months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[monthNumber];
}
export const gross = (basic, addl) => {
  let da = Math.round(basic * DA);
  let hra = Math.round(basic * HRA);
  return basic + da + hra + addl;
};
export const netpay = (basic, addl, disability, gpf, gsli) => {
  if (disability) {
    if (gsli) {
      return gross(basic, addl) - gpf - gsli;
    } else {
      return gross(basic, addl) - gpf;
    }
  } else {
    if (gsli) {
      return gross(basic, addl) - gpf - gsli - ptaxCalc(gross(basic, addl));
    } else {
      return gross(basic, addl) - gpf - ptaxCalc(gross(basic, addl));
    }
  }
};

export const funchra = basic => {
  return Math.round(basic * HRA);
};
export const funcda = basic => {
  return Math.round(basic * DA);
};

export const funcmda = basic => {
  if (basic === 24700 || basic === 28900) {
    return Math.round(basic * DA);
  } else {
    return Math.round(RoundTo(basic - basic * 0.03, 100) * DA);
  }
};
export const funcmhra = basic => {
  if (basic === 24700 || basic === 28900) {
    return Math.round(basic * HRA);
  } else {
    return Math.round(RoundTo(basic - basic * 0.03, 100) * HRA);
  }
};

export function findEmptyValues(obj) {
  let isValid = true;
  const emptyValues = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (
        value === null ||
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && Object.keys(value).length === 0)
      ) {
        emptyValues[key] = value;
        isValid = false;
      }
    }
  }

  return isValid;
}

function isEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
}

export function validateEmptyValues(obj) {
  const emptyFields = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (isEmpty(obj[key])) {
        emptyFields[key] = 'Field is empty';
      }
    }
  }

  return emptyFields;
}

export function roundSo(number, to) {
  return Math.round(number / to, 0) * to;
}
export function randBetween(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const RoundTo = (number, multiple) => {
  // Calculate the remainder when number is divided by multiple
  var remainder = number % multiple;

  // If remainder is less than half of multiple, round down
  // Otherwise, round up
  if (remainder < multiple / 2) {
    return number - remainder;
  } else {
    return number + multiple - remainder;
  }
};

export function printDate() {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  const nthNumber = number => {
    return number > 0
      ? ['th', 'st', 'nd', 'rd'][
          (number > 3 && number < 21) || number % 10 > 3 ? 0 : number % 10
        ]
      : '';
  };

  return `${day}${nthNumber(day)} of ${month}, ${year}`;
}
export const getCurrentDateInput = date => {
  if (date) {
    let data = date.split('-');
    let day = data[0];
    let month = data[1];
    let year = data[2];
    return `${year}-${month}-${day}`;
  }
};
export const getSubmitDateInput = date => {
  if (date) {
    let data = date.split('-');
    let day = data[2];
    let month = data[1];
    let year = data[0];
    return `${day}-${month}-${year}`;
  }
};
export const getSubmitDateSlashInput = date => {
  if (date) {
    let data = date.split('/');
    let day = data[1];
    let month = data[0];
    let year = data[2];
    if (parseInt(day) < 10) {
      day = '0' + day;
    }
    if (parseInt(month) < 10) {
      month = '0' + month;
    }
    return `${year}-${month}-${day}`;
  }
};

export const todayInString = () => {
  const date = new Date();
  let day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  let year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
export function DDMMYYYYtoNewDate(dateString) {
  const [day, month, year] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-based in JS
}
export function NewDateToDDMMYYYY(date) {
  const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
export const IndianFormat = x => {
  if (x !== undefined) {
    x = x.toString();
    var afterPoint = '';
    if (x.indexOf('.') > 0) afterPoint = x.substring(x.indexOf('.'), x.length);
    x = Math.floor(x);
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers !== '') lastThree = ',' + lastThree;
    return (
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
      lastThree +
      afterPoint
    );
  } else return;
};

export function INR(input) {
  const rupees = Number(parseInt(input, 10));
  const output = [];

  if (rupees === 0) {
    output.push('zero');
  } else if (rupees === 1) {
    output.push('one');
  } else {
    const crores = Math.floor(rupees / 10000000) % 100;
    if (crores > 0) {
      output.push(`${getHundreds(crores)} Crore`);
    }

    const lakhs = Math.floor(rupees / 100000) % 100;
    if (lakhs > 0) {
      output.push(`${getHundreds(lakhs)} Lakh`);
    }

    const thousands = Math.floor(rupees / 1000) % 100;
    if (thousands > 0) {
      output.push(`${getHundreds(thousands)} Thousand`);
    }

    const hundreds = Math.floor((rupees % 1000) / 100);
    if (hundreds > 0 && hundreds < 10) {
      output.push(`${getOnes(hundreds)} Hundred`);
    }

    const tens = rupees % 100;
    if (tens > 0) {
      if (rupees > 100) output.push('and');
      output.push(`${getHundreds(tens)}`);
    }
  }

  return ['Rupees', ...output, 'only']
    .join(' ')
    .split(/\s/)
    .filter(e => e)
    .map(e => e.substr(0, 1) + e.substr(1))
    .join(' ');
}

function getOnes(number) {
  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
  ];
  return ones[number] || '';
}

function getTeens(number) {
  const teens = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  return teens[number] || '';
}

function getTens(number) {
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];
  return tens[number] || '';
}

function getHundreds(num) {
  if (num > 0 && num < 10) {
    return getOnes(num);
  }
  if (num >= 10 && num < 20) {
    return getTeens(num % 10);
  }
  if (num >= 20 && num < 100) {
    return `${getTens(Math.floor(num / 10))}${
      getOnes(num % 10) !== '' ? '-' : ' '
    }${getOnes(num % 10)}`;
  }
  return '';
}

export const calculateRetirementDate = joiningDate => {
  const joinedYear = parseInt(joiningDate.substring(0, 4), 10);
  const joinedMonth = parseInt(joiningDate.substring(5, 7), 10);
  const currentYear = new Date().getFullYear();
  const retirementYear = joinedYear + 60;

  let retirementMonth = joinedMonth;
  let retirementDay = new Date(retirementYear, retirementMonth, 0).getDate();

  if (currentYear >= retirementYear) {
    retirementMonth = 12;
    retirementDay = new Date(retirementYear, retirementMonth, 0).getDate();
  }

  if (new Date(joiningDate).getDate() === 1) {
    return `${retirementDay.toString().padStart(2, '0')}-${(retirementMonth - 1)
      .toString()
      .padStart(2, '0')}-${retirementYear}`;
  } else {
    return `${retirementDay.toString().padStart(2, '0')}-${retirementMonth
      .toString()
      .padStart(2, '0')}-${retirementYear}`;
  }
};

export const generateID = () => {
  const capitalAlphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  let randomCode = '';

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * capitalAlphabets.length);
    randomCode += capitalAlphabets[randomIndex];
  }

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    randomCode += numbers[randomIndex];
  }

  return randomCode;
};
export function compareObjects(x, y) {
  if (x === y) return true;
  // if both x and y are null or undefined and exactly the same

  if (!(x instanceof Object) || !(y instanceof Object)) return false;
  // if they are not strictly equal, they both need to be Objects

  if (x.constructor !== y.constructor) return false;
  // they must have the exact same prototype chain, the closest we can do is
  // test there constructor.

  for (var p in x) {
    if (!x.hasOwnProperty(p)) continue;
    // other properties were tested using x.constructor === y.constructor

    if (!y.hasOwnProperty(p)) return false;
    // allows to compare x[ p ] and y[ p ] when set to undefined

    if (x[p] === y[p]) continue;
    // if they have the same strict value or identity then they are equal

    if (typeof x[p] !== 'object') return false;
    // Numbers, Strings, Functions, Booleans must be strictly equal

    if (!compareObjects(x[p], y[p])) return false;
    // Objects and Arrays must be tested recursively
  }

  for (p in y) if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
  // allows x[ p ] to be set to undefined

  return true;
}

export const DateValueToSring = dateValue => {
  if (dateValue) {
    let date = new Date(dateValue);
    return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} At ${
      date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
    }:${date.getMinutes()}:${date.getSeconds()} ${
      date.getHours() > 12 ? 'PM' : 'AM'
    }`;
  }
};
export function removeDuplicates(books) {
  // Create an array of objects

  // Declare a new array
  let newArray = [];

  // Declare an empty object
  let uniqueObject = {};
  let objTitle;
  // Loop for the array elements
  for (let i in books) {
    // Extract the title
    objTitle = books[i]['id'];

    // Use the title as the index
    uniqueObject[objTitle] = books[i];
  }

  // Loop to push unique object into array
  for (let i in uniqueObject) {
    newArray.push(uniqueObject[i]);
  }

  // Display the unique objects
  return newArray;
}
export function removeDuplicateValues(books) {
  // Create an array of objects

  // Declare a new array
  let newArray = [];

  // Declare an empty object
  let uniqueObject = {};
  let objTitle;
  // Loop for the array elements
  for (let i in books) {
    // Extract the title
    objTitle = books[i]['value'];

    // Use the title as the index
    uniqueObject[objTitle] = books[i];
  }

  // Loop to push unique object into array
  for (let i in uniqueObject) {
    newArray.push(uniqueObject[i]);
  }

  // Display the unique objects
  return newArray;
}
export function uniq(a) {
  return a.sort().filter(function (item, pos, ary) {
    return !pos || item !== ary[pos - 1];
  });
}

// Function to retrieve values from second array using keys from the first array
export const getValues = (firstArray, secondArray, sl) => {
  return secondArray.map((obj, index) => {
    return (
      <tr className="text-center" key={index}>
        <td className="text-center">{sl + index + 1}</td>
        {firstArray.map((key, i) => (
          <td className="text-center" key={i}>
            {obj.hasOwnProperty(key) ? obj[key] : null}
          </td>
        ))}
      </tr>
    );
  });
};

export const getServiceAge = date => {
  if (!date) return '';
  let currentDate = Date.now();
  let birthDate = Date.parse(getCurrentDateInput(date));
  let yearInMillis = 31556926000;
  let age = Math.floor((currentDate - birthDate) / yearInMillis);
  return age;
};
export const getServiceLife = date => {
  if (!date) return '';
  let currentDate = Date.now();
  let birthDate = Date.parse(getCurrentDateInput(date));
  let yearInMillis = 31556926000;
  let monthinMillis = 2629800000;
  let age = Math.floor((currentDate - birthDate) / yearInMillis);
  let months = Math.floor(
    ((currentDate - birthDate) % yearInMillis) / monthinMillis,
  );
  if (age) {
    return `${age} years ${months} months`;
  } else {
    return `${months} months`;
  }
};
export const filterArrayExtraItems = (x, y) => {
  return x.filter(item => !y.includes(item));
};
export const filterArraySameItems = (x, y) => {
  return x.filter(item => y.includes(item));
};
export const uniqArray = a => [...new Set(a)];
export const monthNamesWithIndex = [
  { monthName: 'January', index: '01', rank: 1 },
  { monthName: 'February', index: '02', rank: 2 },
  { monthName: 'March', index: '03', rank: 3 },
  { monthName: 'April', index: '04', rank: 4 },
  { monthName: 'May', index: '05', rank: 5 },
  { monthName: 'June', index: '06', rank: 6 },
  { monthName: 'July', index: '07', rank: 7 },
  { monthName: 'August', index: '08', rank: 8 },
  { monthName: 'September', index: '09', rank: 9 },
  { monthName: 'October', index: '10', rank: 10 },
  { monthName: 'November', index: '11', rank: 11 },
  { monthName: 'December', index: '12', rank: 12 },
];

export const createDownloadLink = (myData, fileName) => {
  const json = JSON.stringify(myData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const href = URL.createObjectURL(blob);

  // create "a" HTLM element with href to file
  const link = document.createElement('a');
  link.href = href;
  link.download = fileName + '.json';
  document.body.appendChild(link);
  link.click();

  // clean up "a" element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};
export function round5(x) {
  return Math.ceil(x / 5) * 5;
}

export const setInputNumberMaxLength = (value, maxLength) => {
  if (value) {
    if (value.length > maxLength) {
      return value.slice(0, maxLength);
    } else {
      return value;
    }
  }
};

export const btnArray = [
  { label: 'Add', color: 'success' },
  { label: 'Edit', color: 'warning' },
  { label: 'Delete', color: 'danger' },
  { label: 'View', color: 'info' },
  { label: 'Print', color: 'primary' },
  { label: 'Export', color: 'dark' },
  { label: 'Import', color: 'light' },
  { label: 'Save', color: 'secondary' },
  { label: 'Reset', color: 'light' },
  { label: 'Search', color: 'info' },
  { label: 'Refresh', color: 'warning' },
  { label: 'Download', color: 'primary' },
  { label: 'Upload', color: 'success' },
  { label: 'Send', color: 'info' },
  { label: 'Receive', color: 'warning' },
  { label: 'Forward', color: 'danger' },
];

export const sortMonthwise = array => {
  return array.sort((a, b) => {
    if (a.year === b.year) {
      return months.indexOf(a.month) - months.indexOf(b.month); // Sort by month
    }
    return a.year - b.year; // Sort by year
  });
};

const alphabetArray = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(i + 65),
);

export function getRandomAlphabet() {
  const randomIndex = Math.floor(Math.random() * alphabetArray.length);
  return alphabetArray[randomIndex];
}

export const showConfirmationDialog = (confMessage, alertMessage, Func) => {
  return Alert.alert('Hold On!', `'Are You Sure? You want to ${confMessage}`, [
    // The "No" button
    // Does nothing but dismiss the dialog when tapped
    {
      text: 'Cancel',
      onPress: () => showToast('success', alertMessage),
    }, // The "Yes" button
    {
      text: 'Yes',
      onPress: async () => {
        await Func();
      },
    },
  ]);
};
