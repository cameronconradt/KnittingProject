var app = new Vue({
	el: '#app',
	data: {
		patterns: [],
		patternID: '',
		show: 'patterns',
		name: 'name',
		content: 'Type Next Row Here',
		rows: [],
		position: 0,
		current: false,
		drag: {},
	},
	created: function(){
		this.getPatterns();
	},
	watch: {
		position: function(value,oldvalue) {
		  if(value >= this.rows.length){
			this.current = false;
			this.position = 0;
			this.show = 'done';
			this.updatePattern();
		  }
		  else{this.position = value;}
		},
	},
	computed: {
		currentPatterns: function() {
			return this.patterns.filter(function(pattern){
				return !pattern.current;
			});
		},
		filteredPatterns: function(){
			if(this.show === 'patterns' ){
				return this.patterns;
			}
			if(this.show === 'current'){
				return this.patterns.filter(function(pattern){
					return pattern.current;
				});
			}
			return null;
		},
		filteredRows: function(){
			if(this.show === 'patternID'){
				return this.rows.slice(this.position);
			}
			else if(this.show === 'edit'){
				return this.rows;
			}
			return null;
		}
	},
	methods: {
		getPatterns: function(){
			axios.get("/api/patterns").then(response => {
				this.patterns = response.data;
				return true;
			}).catch(err=> {
			});
		},
		getPattern: function(patternID){
			axios.get("/api/patterns/" + patternID).then(response =>{
				let pattern = response.data;
				this.name = pattern.name;
				this.position = pattern.position;
				this.rows = pattern.rows;
				this.current = pattern.current;
				return true;
			}).catch(err=>{
			});
		},
		addPattern: function(){
			axios.post("/api/patterns", {
				name: this.name,
				rows: this.rows,
				position: this.position,
				current: this.current,
			}).then(response => {
				this.rows = [];
				this.position = 0;
				this.current = false;
				this.patternID = response.data.id;
				console.log(response.data.id);
				this.getPatterns();
				return true;
			}).catch(err=>{

			});
		},
		updatePattern: function(){
			axios.put("/api/patterns/" + this.patternID,{
				name: this.name,
				rows: this.rows,
				position: this.position,
				current: this.current,
			}).then(response => {
				this.getPatterns();
				return true;
			})
		},
		deletePattern: function(item){
			axios.delete("/api/patterns/" + item.id).then(response=>{
				this.getPatterns();
				return true;
			}).catch(err=> {

			});
		},
		dragPattern: function(item){
			this.drag = item;
		},
		dropPattern: function(item){
			axios.put("/api/items/" + this.drag.id,{
				name: this.name,
				rows: this.rows,
				position: this.position,
				current: this.current,
				orderChange: true,
				orderTarget: item.id
			}).then(response =>{
				this.getPatterns();
				return true;
			}).catch(err=>{
			});
		},
		dragRow: function(item){
			this.drag = item;
		},
		dropRow: function(item){
			axios.put("/api/items/" + patternID + "/" + item.id,{
				content: item.content,
				orderChange: true,
				orderTarget: item.id
			}).then(response=>{
				this.getPattern(patternID);
				return true;
			}).catch(err=>{
			});
		},
		addRow: function(){
			this.rows.push(this.content);
			this.content = 'Type Next Row Here';
			this.updatePattern(this.patternID);
		},
		deleteRow: function(item){
			let removeIndex = this.rows.map(row => {return row}).indexOf(item);
			if(removeIndex === -1){
				return false;
			}
			this.rows.splice(removeIndex,1);
			this.updatePattern(this.patternID);
			return true;
		},
		showCurrent: function(){
			this.patternID = '';
			this.show = 'current';
		},
		showProject: function(item){
			this.patternID = item.id;
			this.show = 'patternID';
			this.rows = item.rows;
			this.current = true;
			this.position = item.position;
			this.updatePattern();
		},
		showAll: function(){
			this.patternID = '';
			this.show = 'patterns';
		},
		startPattern: function(item){
			this.showProject(item);
		},
		editPattern: function(item){
			if(item != null){
				this.name = item.name;
				this.rows = item.rows;
				this.position = item.position;
				this.current = item.current;
				this.show = 'edit';
				this.id = this.patternID;
			}
			this.show = 'edit';
		},
		addProjectForm: function(){
			this.show = 'addPattern';
			this.name = 'Pattern Name';
			this.rows = [];
		},
		addNewPattern: function(){
			this.rows = [];
			this.addPattern();
			this.editPattern();
		},
		nextRow: function(){
			this.position = this.position + 1;
			this.updatePattern();
		}
	}
});
