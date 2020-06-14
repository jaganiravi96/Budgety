//BUDGET CONTROLLER
var budgetController = (function(){
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
        
    var Data = {
        allItems : {
            inc : [],
            exp : []
        },
        totals : {
            exp : 0,
            inc : 0
        },
        budget : 0,
        percentage : -1
    };
    
    return {
        addItem: function(type, des, val){
            var ID, newItem;
            
            //create new ID
            if(Data.allItems[type].length === 0){
                ID = 0;
            }
            else{
                ID = Data.allItems[type][Data.allItems[type].length - 1].id + 1;    
            }
            //create new income or expense object
            if(type === 'inc'){
                newItem = new Income(ID, des, val);  
                Data.totals[type] = Data.totals[type] + val;
            }
            else if(type === 'exp'){
                newItem = new Expense(ID, des, val);
                Data.totals[type] = Data.totals[type] + val;
            }
            
            // add int data structure
            Data.allItems[type].push(newItem);
            return newItem;
        },
        
        deleteItem: function(type, id){
            var ids, index;
            ids = Data.allItems[type].map(function(current) {
                return current.id;
            });
            console.log(ids.indexOf(id));
            index = ids.indexOf(id);
            
            if(index !== -1){
               Data.allItems[type].splice(index,1);
               Data.totals[type] = Data.totals[type] + val;
            }
            
        },
        
        calculateBudget: function(){
            //1. calculate exp and inc
            var expense = Data.totals.exp;
            var income = Data.totals.inc;
            
            //2. calculate budget
            Data.budget = income - expense;
            
            //3. calculate percentage of expense
            if(income > 0){
                Data.percentage = Math.round((expense / income) * 100);
            }            
            
            //4. return the values
            return {
                budget : Data.budget,
                expense : expense,
                income : income,
                percentage : Data.percentage
            };
        },
        
        
        testing: function(){
            console.log(Data);
        }
    };
    
    
})();
  
//UI CONTROLLER
var UIController = (function(){
    
    var DOMStrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        expensesContainer : '.expenses__list',
        budgetmonth : '.budget__title--month',
        budgetlabel : '.budget__value',
        incomelabel : '.budget__income--value',
        percentagelabel1 : '.budget__income--percentage',
        expenselabel : '.budget__expenses--value',
        percentagelabel2 : '.budget__expenses--percentage',
        container : '.container'
    };
    
    return {
        getinput : function(){
            return {
                type : document.querySelector(DOMStrings.inputType).value,
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMStrings.inputValue).value)          
            };
        },
        
        AddListItem : function(obj, type){
            var html, newHtml, element;
            //create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%ID%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%ID%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
                        
            //Replace the placeholder text with some actual data
            newHtml = html.replace('%ID%', obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);
            
            //Inset the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        
        deleteListItem : function(selectorId) {
            console.log(selectorId);
            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        },
        
        //clear the fields after input
        clearFieldS : function() {
            var fields, fieldArr;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            fieldArr = Array.prototype.slice.call(fields);
            
            fieldArr.forEach(function(current, index, Array){
               current.value = ""; 
            });
            
            fieldArr[0].focus();            
        },
        
        //display budget
        displaybudget : function(obj){
            document.querySelector(DOMStrings.budgetlabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomelabel).textContent = obj.income;
            document.querySelector(DOMStrings.expenselabel).textContent = obj.expense;
            
            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentagelabel2).textContent = obj.percentage + '%';                
            }
            else{
               document.querySelector(DOMStrings.percentagelabel2).textContent = '---';            
            }
            
        },
         
        getDOMString : function() {
            return DOMStrings;
        }
    }; 
    
    
    
})();

//GLOBAL APP CONTROLLER
var controller = (function(bugctrl, uictrl){
    
    var setupEventListners = function(){
        var DOM = uictrl.getDOMString();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }   
        }); 
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };
    
    var updateBudget = function() {
         
        //1. Calculate the budget
        var budget = bugctrl.calculateBudget();
        console.log(budget);
        
        //2. Display the budget on UI
        uictrl.displaybudget(budget);
    };
    
    var ctrlAddItem = function(){
        var input, newItem;
         //1. Get the input data
        input = uictrl.getinput();
        
        if(input.description !== "" && input.value > 0 && !isNaN(input.value)){
            //2. Add the item to budget controller
            newItem = bugctrl.addItem(input.type, input.description, input.value);
        
            //3. Add item to the UI
            uictrl.AddListItem(newItem, input.type);
        
            //4. clear input field
            uictrl.clearFieldS();
        
            //5. calculate the budget
            updateBudget(); 
        }
        
    };
    
    var ctrlDeleteItem = function(event){
      var itemId, splitId, type, Id;      
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId){
            splitId = itemId.split('-');
            type = splitId[0];
            Id = parseInt(splitId[1]);
             
            console.log(type, Id);
            //1. delete the item from data structure
            bugctrl.deleteItem(type, Id);
            
            //2. delete item from UI
            uictrl.deleteListItem(itemId);
            
            //3. Update and show the Budget
            
        }
        
    };
    
    return{
        init: function(){
            console.log('init method');
            // it will reset the value as no input given
            uictrl.displaybudget({
                budget : 0,
                expense : 0,
                income : 0,
                percentage : 0
            });
            setupEventListners();
        }
    };
    
})(budgetController, UIController);

controller.init();