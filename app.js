const storageCtrl = (()=>{
  return {
    storeItem:function(item){
      let items ;
      if(localStorage.getItem('items') === null ){
        items = []
        items.push(item)
      } else {
        items = JSON.parse(localStorage.getItem('items'))
        items.push(item)
      }
      localStorage.setItem('items',JSON.stringify(items))
    },
    getItem:function(){
      let items;
      if(localStorage.getItem('items') === null ){
        items = []
      } else {
        items = JSON.parse(localStorage.getItem('items'))
      }
      return items;
    },
    updateItemStorage: function(updateItem){
      let items = JSON.parse(localStorage.getItem('items'))
      items.forEach((item,index)=>{
        if(item.id === updateItem.id) {
          items.splice(index,1,updateItem);
        }
      })
      localStorage.setItem('items',JSON.stringify(items))
    },
    deleteFromLocalStorage: function(deleteItem){
      let items = JSON.parse(localStorage.getItem('items'))
      items.forEach((item,index)=>{
        if(item.id === deleteItem.id) {
          items.splice(index,1);
        }
      })
      localStorage.setItem('items',JSON.stringify(items))
    },
    clearAllFromStorage: function(){
      localStorage.removeItem('items');
    }
    
  }
})()



const ItemCtrl =(()=>{
  const Item = function(id, name, cal){
    this.id= id
    this.name= name
    this.cal = cal
  }

  const data ={
    items :storageCtrl.getItem(),
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
    updateItem : function(name,cal){
      cal = parseInt(cal)
      let temp= ''
      data.items.forEach((item)=>{
        if(item.id === data.currentItem.id) {
          item.name = name
          item.cal = cal
          temp = item
        }
      })
      return temp
    },
    deleteItem: function(id){
      ids= data.items.map(item=>{
        return item.id
      })
      const index = ids.indexOf(id);
      data.items.splice(index,1)
    },
    getItemById: function(id){
      let temp = '';
      data.items.forEach((item)=>{
        if(item.id === id) {
          temp = item;
        }
      })
      return temp;
    },
    clearAll :function(){
      data.items = []
    },
    setCurrentItem : function(item){
      data.currentItem = item;
    },
    getCurrentItem : function(){
      return data.currentItem
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
    updateBtn:'.update-btn',
    delBtn:'.delete-btn',
    backBtn:'.back-btn',
    itemNameInput:'#item-name',
    itemCaloriesInput:'#item-calories',
    totalCal:'.total-calories',
    listItems: '#item-list li',
    clearBtn: '.clear-btn'
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
      <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
    </li>`
    });
    document.querySelector(UISelector.itemList).innerHTML = html
  },
  clearEdit:function(){
    UICtrl.clearInput()
    document.querySelector(UISelector.addBtn).style.display = 'inline'
    document.querySelector(UISelector.delBtn).style.display = 'none'
    document.querySelector(UISelector.updateBtn).style.display = 'none'
    document.querySelector(UISelector.backBtn).style.display = 'none'
  },
  showEditState:function(){
    document.querySelector(UISelector.addBtn).style.display = 'none'
    document.querySelector(UISelector.delBtn).style.display = 'inline'
    document.querySelector(UISelector.updateBtn).style.display = 'inline'
    document.querySelector(UISelector.backBtn).style.display = 'inline'
  },
  addItemToForm: function(){
    document.querySelector(UISelector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
    document.querySelector(UISelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().cal;
    UICtrl.showEditState()
  },
  updateListItem: function(item) {
    let listItems = document.querySelectorAll(UISelector.listItems)
    listItems = Array.from(listItems)
    listItems.forEach((listItem)=>{
      const id = listItem.getAttribute('id')
      if(id === `item-${item.id}`) {
        document.querySelector(`#${id}`).innerHTML = ` <strong>
        ${item.name}
        </strong>
        <em>${item.cal} Calories</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`
      }
    })

  },
  deleteListItem : function(item){
    console.log(item)
    const itemId = `#item-${item}`
    document.querySelector(itemId).remove()
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
    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`

    document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend',li)
  },
  clearInput:function(){
    document.querySelector(UISelector.itemNameInput).value = '';
    document.querySelector(UISelector.itemCaloriesInput).value = '';
  },
  removeItems: function(){
    let listItems = document.querySelectorAll(UISelector.listItems)
    let listArr = Array.from(listItems)
    listArr.forEach((item)=>{item.remove()})
  },
  showTotalCal :function(cal){
    document.querySelector(UISelector.totalCal).textContent = cal
  },
  getSelectors :function(){
    return UISelector
  }
 }
})()

const App =((ItemCtrl,UICtrl,storageCtrl)=>{

  const loadEventListners = function(){
    const UISelector = UICtrl.getSelectors();

    document.querySelector(UISelector.addBtn).addEventListener('click',itemAddSubmit)
    document.querySelector(UISelector.itemList).addEventListener('click',itemEditClick)
    document.querySelector(UISelector.updateBtn).addEventListener('click',itemUpdateSubmit)
    document.querySelector(UISelector.backBtn).addEventListener('click',goBack)
    document.querySelector(UISelector.delBtn).addEventListener('click',deleteItemSubmit)
    document.querySelector(UISelector.clearBtn).addEventListener('click',clearAllItems)


    document.addEventListener('keypress',function(e){
      if( e.keyCode === 13 || e.which === 13) {
        e.preventDefault()
        return false
      }
    })

  }

  const goBack = function(e) {
    e.preventDefault()
    UICtrl.clearEdit()
  }

  const itemAddSubmit = function(e){
    e.preventDefault();
    const input = UICtrl.getItemInput()
    if(input.name !== '' && input.cal > 0) {
       const newItem = ItemCtrl.addItem(input.name,input.cal);
       UICtrl.addListItem(newItem)
      
       const totalCal = ItemCtrl.getTotalCal()
       UICtrl.showTotalCal(totalCal);
       storageCtrl.storeItem(newItem)
       UICtrl.clearInput()
    }
  }

  const itemUpdateSubmit = function(e){
    e.preventDefault()
    const data = UICtrl.getItemInput()
    const updateItem = ItemCtrl.updateItem(data.name,data.cal)
    UICtrl.updateListItem(updateItem)
    const totalCal = ItemCtrl.getTotalCal()
    UICtrl.showTotalCal(totalCal);
    storageCtrl.updateItemStorage(updateItem)
    UICtrl.clearEdit()
  }

  const itemEditClick = function(e){
    e.preventDefault()
    if(e.target.classList.contains('edit-item')){
      const listId = e.target.parentNode.parentNode.id
      const listIdArray = listId.split('-');
      const id= parseInt(listIdArray[1])  
      const itemToEdit = ItemCtrl.getItemById(id)
      ItemCtrl.setCurrentItem(itemToEdit)
      UICtrl.addItemToForm();
    }
  }

  const deleteItemSubmit = function(e) {
    e.preventDefault();
    const currentItem = ItemCtrl.getCurrentItem()
    ItemCtrl.deleteItem(currentItem.id);
    UICtrl.deleteListItem(currentItem.id)
    const totalCal = ItemCtrl.getTotalCal()
    UICtrl.showTotalCal(totalCal);
    storageCtrl.deleteFromLocalStorage(currentItem)
    UICtrl.clearEdit()
  }

  const clearAllItems = function(){
    storageCtrl.clearAllFromStorage()
    ItemCtrl.clearAll()
    UICtrl.removeItems()
    const totalCal = ItemCtrl.getTotalCal()
    UICtrl.showTotalCal(totalCal);
    UICtrl.hideList()
  }
  
  
  return{
    init:function(){
      UICtrl.clearEdit()
      const items = ItemCtrl.getItems()
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
})(ItemCtrl,UICtrl,storageCtrl)

App.init()