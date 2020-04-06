// =========================  //
// ======*** Intro ***======  //
// =========================  //


// This is my code for the List Organizer Page
// The first version was my Shopping List Page


// *** My variables ***

// let activeList;
// let activeListName;

// *** My Functions ***

// updateActiveList()
// fillAndDisplayList()
// initializeTabs()
// initializeButtons()
// addNewItem()
// updateStrikethrough()
// updateCheckBoxes()


// *** Placed Event listeners ***

//  All Tabs                => in the initializeTabs function
//  The Add Button          => in the initializeButtons function
//  All MarkAll Buttons     => in the initializeButtons function
//  All Clear Buttons       => in the initializeButtons function
//  All Checkboxes          => in the updateCheckboxes function

// ===========================  //
// ======*** My Code ***======  //
// ===========================  //



// This variable will contain the list of items for the active tab.
// Each list item will be included in this array as an object with 2
// properties, one for the text and one for the status.
let activeList;

// The list which is active in the page:
let activeListName = document.querySelector('.activeTab').id;

// The first things that needs to run:
initializeTabs();
initializeButtons();
updateActiveList();

// *** Function *** //
// Placing event listeners on the clickable Labels
function initializeTabs() {
    // in this page we have 4 tabsLabels for 4 listWrapper
    let tabLabels = document.querySelectorAll('.menu li');
    console.log(tabLabels);
    let tabLists = document.querySelectorAll('.listWrapper');
    console.log(tabLists);
    // we need event listeners for all the tabs 
    // to show only the active listWrapper and hide the others 
    // and mark the clicked tab and listWrapper as active
    // then populate and display the list from the storage data
    tabLabels.forEach((tab, i) => {
        tab.addEventListener('click', e => {
            console.log('a tab was clicked');
             // remove the activeTab class from all the tabs
            tabLabels.forEach(tab => {
                tab.classList.remove('activeTab');
            });
            // remove the activeList class from all the listWrappers
            // add the hidden class to all the listWrappers
            tabLists.forEach(list => {
                list.classList.remove('activeWrapper');
                list.classList.add('hidden');
            });
            // add the activeTab class to the clicked (i-th) tab
            tab.classList.add('activeTab');
            // add the activeList class to the i-th list
            tabLists[i].classList.add('activeWrapper');
            tabLists[i].classList.remove('hidden');
            console.log(tabLists[i]);
            // update the active list name to get the right data from the storage
            activeListName = document.querySelector('.activeTab').id;
            // fill the array from storage and display the list
            updateActiveList();
        })
    })
}

// *** Function *** //
// Placing event listeners 
function initializeButtons() {

    // *** The Add (+) Button *** //
    // If the addButton (+) is clicked then run addNewItem and reset the value of the input field
    document.querySelector('#add-button').addEventListener('click', e => {
        // Prevent default is necessary because the button is inside a form
        // and we do not want to reload the page.
        e.preventDefault();
        // we add the input value as new item to the active list
        addNewItem();
        // reset the input value to make it more user friendly
        document.querySelector('input').value = '';
    });

    // *** Mark all as completed Button(s) *** //
    // if markAll is clicked then remove the 'notdoneyet' class from all the list items and update the list, localstorage and the displayed style
    for (let button of document.querySelectorAll('.markAllCompleted')) {
        button.addEventListener('click', e => {
            // don't reload the page
            e.preventDefault();
            let boxes = document.querySelectorAll('.activeWrapper .checkbox');
            boxes.forEach((box, i) => {
                box.classList.add('done');
                // update activeList
                activeList[i].isItDone = true;
                // update the localStorage
                localStorage.setItem(activeListName, JSON.stringify(activeList));
                // update style
                updateStrikethrough();
            });
        });
    }

    // *** Clear All Button(s) *** //
    // if clearCompleted is clicked then update the array and localStorage and repopulate the list
    for (let button of document.querySelectorAll('.clearCompleted')) {
        button.addEventListener('click', e => {
            e.preventDefault();
            // selects all the items that have their isItDone property set to false. Others are ignored, redefining the array
            activeList = activeList.filter(item => item.isItDone == false );
            // update the localStorage
            localStorage.setItem(activeListName, JSON.stringify(activeList));
            // repopulate the list in the HTML
            fillAndDisplayList();
        });
    }
}

// *** Function *** //
// We add the input value as new item to the active list
function addNewItem() {
    // Only add a new list item if there is a value in the input
    const newestListItem = document.querySelector('#item-to-add').value;
    if(newestListItem){
        // create an object with the input value as text
        // and a default false value of not checked
        const listObject = {
            text : newestListItem,
            isItDone : false
        };
        // if todoList active
        if (activeListName == 'todoList') {
            // set a default false value for high priority
            listObject.highPriority = false; 
        }
        console.log(listObject);
        console.log(activeList);
        // add the new list item to the active list array
        activeList.push(listObject);
        // update the localstorage
        localStorage.setItem(activeListName, JSON.stringify(activeList));
        // repopulate the list in the HTML
        fillAndDisplayList();
    } else {
        // display error 
        console.log('You must write something to add');
    }
}

// *** Function *** //
// This function search the localStorage for existing data 
// and parse it in our working array
// then displays the list in the active listWrapper.
function updateActiveList() {
    // first get the data from the storage
    activeList = JSON.parse(localStorage.getItem(activeListName));
    if (activeList) {
        // if found some data
        console.log('There is data in the LocalStorage for the active list');
        console.log('Active array contents:', activeList);
        // then present it on the page
        fillAndDisplayList();
    } else {
        // If no data in the storage - continue
        console.log('No data in the localStorage for the active list');
        activeList = [];
    }
}

// *** Function *** //
// Populates the list in the HTML
function fillAndDisplayList() {
    // Delete the current list ;
    const list = document.querySelector('.activeWrapper .list');
    list.innerHTML = '';
    // Create a new item in the list for every item in the activeList array
    activeList.forEach(item => {
        // we create a wrapper for the item
        const itemWrapper = document.createElement('div');
        itemWrapper.classList.add('itemWrapper');
        // each item will have a textbox and checkbox which we append to the itemwrapper
        const condition = item.isItDone;
        // (condition == false) we don't add a class
        // (condition == true) we add the class 'done'
        if (activeListName == 'todoList') {    
            itemWrapper.innerHTML = `
            <div class="itemText"><i class="fas fa-exclamation"></i>${item.text}</div>
            <div class="checkbox ${condition == true ? 'done': ''}"></div>
            `;
        } else {
            itemWrapper.innerHTML = `
            <div class="itemText">${item.text}</div>
            <div class="checkbox ${condition == true ? 'done': ''}"></div>
            `;
        }
        list.appendChild(itemWrapper);
    });
    // we want our query selector to select the newly created checkboxes too
    updateCheckBoxes();
    // display the checked style for the checked items
    updateStrikethrough();
}

// *** Function *** //
// This function is executed every time the list is populated, in order to get the new boxes.
function updateCheckBoxes () {
    let boxes = document.querySelectorAll('.activeWrapper .checkbox');
    boxes.forEach((box, i) => {
        // If a checkbox is clicked, update the information of the list and storage too and display it in the page
        box.addEventListener('click', () => {
            // toggle the 'done' class
            box.classList.toggle('done');
            // update the activeList array
            if (box.classList.contains('done')) {
                activeList[i].isItDone = true;
            } else {
                activeList[i].isItDone = false;
            }
            // update localStorage as well
            localStorage.setItem(activeListName, JSON.stringify(activeList));
            // update the style and display
            updateStrikethrough();
        });
    });
    let exclamationMarks = document.querySelectorAll('.activeWrapper .itemText i');
    exclamationMarks.forEach((mark, i) => {
        // If an exclamation mark for priority is clicked 
        // update the information of the list and storage too and display it in the page
        mark.addEventListener('click', () => {
            // toggle the priority class on the parent: div.itemText
            mark.parentElement.classList.toggle('priority')
            // update the activeList array
            if (mark.parentElement.classList.contains('priority')) {
                activeList[i].highPriority = true;
            } else {
                activeList[i].highPriority = false;
            }
            // update localStorage as well
            localStorage.setItem(activeListName, JSON.stringify(activeList));

        });
    });
}

// *** Function *** //
// Strike through all the items for which the box is checked
function updateStrikethrough() {
    // get boxes
    let boxes = document.querySelectorAll('.activeWrapper .checkbox');
    boxes.forEach(box => {
        if(box.classList.contains('done')){
            // if the box contains the 'done' class
            // add the class 'marked' to the parent element to strike through the text
            box.parentElement.classList.add('marked');
        } else if (!box.classList.contains('done')) {
            // if the box doesn't contains the 'done' class
            // add the remove 'marked' to the parent element to not to be striked through
            box.parentElement.classList.remove('marked');
        }
    });
}


