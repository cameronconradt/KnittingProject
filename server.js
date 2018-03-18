const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

let patterns = [];
let id = 0;

app.get('/api/patterns', (req, res) => {
  res.send(patterns);
});

app.get('/api/patterns/:id', (req,res) => {
  let id = parseInt(req.params.id);
  let patternsMap = patterns.map(pattern => {return pattern.id;});
  let index = patternsMap.indexOf(id);
  res.send(patterns[index]);
})

app.post('/api/patterns', (req, res) => {
  let pattern = {id:id, name:req.body.name, rows:req.body.rows, position:req.body.position, current:req.body.current};
  id = id + 1;
  patterns.push(pattern);
  res.send(pattern);
});

app.put('/api/patterns/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let patternsMap = patterns.map(pattern => {return pattern.id;});
  let index = patternsMap.indexOf(id);
  let pattern = patterns[index];
  pattern.name = req.body.name;
  pattern.rows = req.body.rows;
  pattern.position = req.body.position;
  pattern.current = req.body.current;
  if(req.body.orderChange){
    let indexTarget = patternsMap.indexOf(req.body.orderTarget);
    patterns.splice(index,1);
    patterns.splice(indexTarget,0,pattern);
  }
  res.send(pattern);
});

app.put('/api/patterns/:id/:row', (req,res) =>{
  let id = parseInt(req.params.id);
  let patternsMap = patterns.map(pattern => {return pattern.id;});
  let index = patternsMap.indexOf(id);
  let pattern = patterns[index];
  let rowID = parseInt(req.params.row);
  let rowMap = pattern.rows.map(pattern => {return pattern.row.id});
  let indexRow = rowMap.indexOf(rowID);
  let row = pattern.rows[indexRow];
  row.content = req.body.content;
  if(req.body.orderChange){
    let indexTarget = rowMap.indexOf(req.body.orderTarget);
    pattern.rows.splice(indexRow,1);
    pattern.rows.splice(indexTarget,0,row);
  }
  res.send(pattern);
  });

app.delete('/api/patterns/:id', (req,res) =>{
  let id = parseInt(req.params.id);
  let removeIndex = patterns.map(pattern => {return pattern.id}).indexOf(id);
  if(removeIndex === -1){
    res.status(404).send("Pattern does not exist");
    return;
  }
  patterns.splice(removeIndex,1);
  res.sendStatus(200);
});
app.delete('/api/patterns/:id/:row', (req,res) =>{
  let id = parseInt(req.params.id);
  let patternIndex = patterns.map(pattern => {return pattern.id}).indexOf(id);
  if(patternIndex === -1){
    res.status(404).send("Pattern does not exist");
    return;
  }
  id = parseInt(req.params.row);
  let removeIndex = patterns[patternIndex].rows.map(row => {return row}).indexOf(id);
  if(removeIndex === -1){
    res.status(404).send("Row does not exist");
    return;
  }
  console.log(removeIndex);
  patterns[patternIndex].rows.splice(removeIndex,1);
  res.sendStatus(200);
});

/*

app.delete('/api/items/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let removeIndex = items.map(item => { return item.id; }).indexOf(id);
  if (removeIndex === -1) {
    res.status(404).send("Sorry, that item doesn't exist");
    return;
  }
  items.splice(removeIndex, 1);
  res.sendStatus(200);
});
*/
app.listen(3000, () => console.log('Server listening on port 3000!'))
