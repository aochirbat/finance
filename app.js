// Дэлгэцтэй ажиллах контроллер
var uiController = (function(){
    var DOMstrings ={
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value', 
        addBtn: '.add__btn',
    };
    return { 
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, 
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },
        getDomStrings: function(){
            return DOMstrings;
        }
    };
})();


//Санхүүтэй ажиллах контроллер
var financeController = (function(){
        var data = {
            allItems:{
                inc : [],
                exp : []
            },
            totals: {
                inc: 0,
                exp: 0
            }
        }
        var Income = function(id , description , value){
            this.id = id;
            this.description = description;
            this.value = value;
        };
        var Expense = function(id , description , value){
            this.id = id;
            this.description = description;
            this.value = value;
        };
})();

//Програмын холбогч контроллер
var appController = (function(uiController , fnController){
        var ctrlAddItem = function(){
          // 1. Оруулах өгөгдөлийг дэлгэцээс олж авна.
            console.log(uiController.getInput());
        // 2. Олж авсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэнд хадгална.

        // 3. Олж авсан өгөгдлүүдээ вэб дээрээ тохирох хэсэгт нь гаргана 

        // 4. Төсвийг тооцоолно.

        // 5. Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана.
    }
    var setupEventListeners = function(){
        var DOM = uiController.getDomStrings();
        document.querySelector(DOM.addBtn).addEventListener("click" , function(){
            ctrlAddItem();
          });
          document.addEventListener("keypress", function(event){
              if(event.keyCode === 13 || event.which === 13) {
                  ctrlAddItem();
              } else {
                  // console.log('oor tovch darj bna');
              }
          });
    };
    return {
        init: function (){
            console.log('Application started.....');
            setupEventListeners();
        }
    }
    
})(uiController , financeController);

appController.init();