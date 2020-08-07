
const ItemCtrl =(()=>{
  const Item = function(id, name, cal){
    this.id= id
    this.name= name
    this.cal = cal
  }

  const data ={
    items :[
      // {id:0,name:'Steak Dinner',cal:1200},
      // {id:1,name:'Cookie',cal:400},
      // {id:2,name:'Paneer',cal:300}
    ],
    currentItem: null,
    totalCalories: 0
  }

  return {
    getItems:function(){
      return data.items
    },
    addItem:function(name,cal){
      let id;
      id = data.items.length > 0 ? data.items[data.items.length -1].id+1 : 0
      newItem = new Item(id, name, cal)
      data.items.push(newItem)
      return newItem
    },
    getTotalCal: function(){
      let cal = 0;
      data.items.forEach(function(item){
        cal += parseInt(item.cal)
      })
      data.totalCalories = cal
      return data.totalCalories
    },
    logdata: function(){
      return data
    }
  }
})()

const UICtrl=(()=>{
  const UISelector ={
    itemList:'#item-list',
    addBtn:'.add-btn',
    itemNameInput:'#item-name',
    itemCaloriesInput:'#item-calories',
    totalCal:'.total-calories'
  }
 return {
  populateItemList :function(items) {
    let html='';
    items.forEach(item => {
      html+=`<li class="collection-item" id='item-${item.id}'>
      <strong>
      ${item.name}
      </strong>
      <em>${item.cal} Calories</em>
      <a href="#" class="secondary-content"><i class="edit-class fa fa-pencil"></i></a>
    </li>`
    });
    document.querySelector(UISelector.itemList).innerHTML = html
  },
  hideList :function(){
    document.querySelector(UISelector.itemList).style.display = 'none'
  },
  getItemInput :function(){
    return {
      name:document.querySelector(UISelector.itemNameInput).value,
      cal:document.querySelector(UISelector.itemCaloriesInput).value
    }
  },
  addListItem:function(item){
    document.querySelector(UISelector.itemList).style.display = 'block'
    const li = document.createElement('li')
    li.className = 'collection-item'
    li.id = `item-${item.id}`
    li.innerHTML=` <strong>
    ${item.name}
    </strong>
    <em>${item.cal} Calories</em>
    <a href="#" class="secondary-content"><i class="edit-class fa fa-pencil"></i></a>`

    document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend',li)
  },
  clearInput:function(){
    document.querySelector(UISelector.itemNameInput).value = '';
    document.querySelector(UISelector.itemCaloriesInput).value = '';
  },
  showTotalCal :function(cal){
    document.querySelector(UISelector.totalCal).textContent = cal
  },
  getSelectors :function(){
    return UISelector
  }
 }
})()

const App =((ItemCtrl,UICtrl)=>{

  const loadEventListners = function(){
    const UISelector = UICtrl.getSelectors();

    document.querySelector(UISelector.addBtn).addEventListener('click',itemAddSubmit)
  }

  const itemAddSubmit = function(e){
    e.preventDefault();
    const input = UICtrl.getItemInput()
    if(input.name !== '' && input.cal > 0) {
       const newItem = ItemCtrl.addItem(input.name,input.cal);
       UICtrl.addListItem(newItem)
      
       const totalCal = ItemCtrl.getTotalCal()
       UICtrl.showTotalCal(totalCal);

       UICtrl.clearInput()
    }
  }
  
  
  return{
    init:function(){
      const items = ItemCtrl.getItems()
      console.log(items,items.length)
      if(items.length === 0){
        UICtrl.hideList()
      } else {
      UICtrl.populateItemList(items)
      }
      
      const totalCal = ItemCtrl.getTotalCal()
      UICtrl.showTotalCal(totalCal);
      loadEventListners()
    }
  }
})(ItemCtrl,UICtrl)

App.init()