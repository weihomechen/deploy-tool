var inquirer = require('inquirer')

const listData = [{
  name: '1',
  value: '0',
  key: 'a',
}, {
  name: '2',
  value: '1',
  key: 'b',
}, {
  name: '3',
  value: '2',
  key: 'c',
}];

inquirer.prompt([{
  type: 'confirm',
  name: 'value',
  message: 'chose a data?',
}]).then((answers) => {
  console.log(`结果为:${JSON.stringify(answers, null, 2)}`);
  console.log(answers.value && 1)
})