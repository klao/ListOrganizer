class BasicRow {
    constructor(data, changeCallback) {
        if (typeof data === "string") {
            this.item = {
                text: data,
                isItDone: false,
            };
        } else {
            this.item = data;
        }
        this.changeCallback = changeCallback;

        // create the DOM element
        const elt = document.createElement("div");
        elt.classList.add("itemWrapper");
        elt.innerHTML = `
            <div class="itemText">${this.item.text}</div>
            <div class="checkbox"></div>
            `;
        elt.querySelector(".checkbox").addEventListener("click", this.toggleCheck.bind(this));
        this.elt = elt;
        this.setDone(this.item.isItDone);
    }

    toggleCheck() {
        this.setDone(!this.item.isItDone);
        this.changeCallback(this);
    }

    setDone(done) {
        this.item.isItDone = done;
        this.elt.querySelector(".checkbox").classList.toggle("done", done);
        this.elt.classList.toggle("marked", done);
    }
}

class PriorityRow extends BasicRow {
    constructor() {
        super(...arguments);
        // Create the exclamation mark
        const exclamation = document.createElement("i");
        exclamation.classList.add("fas", "fa-exclamation");
        exclamation.addEventListener("click", this.togglePriority.bind(this));

        // Add it to our row element
        const textElt = this.elt.querySelector(".itemText");
        textElt.insertAdjacentElement("afterbegin", exclamation);
        if (this.item.highPriority) textElt.classList.add("priority");
    }

    togglePriority() {
        this.setPriority(!this.item.highPriority);
    }

    setPriority(prio) {
        this.item.highPriority = prio;
        this.elt.querySelector(".itemText").classList.toggle("priority", prio);
        this.changeCallback(this);
    }
}

class DayRow extends BasicRow {
    constructor() {
        super(...arguments);
        const self = this;
        // Create the days selector
        const days = document.createElement("div");
        days.classList.add("weekSelection");
        days.innerHTML = `
            <i class="far fa-circle mon"></i>
            <i class="far fa-circle tue"></i>
            <i class="far fa-circle wed"></i>
            <i class="far fa-circle thu"></i>
            <i class="far fa-circle fri"></i>
            <i class="far fa-circle sat"></i>
            <i class="far fa-circle sun"></i>
        `;
        days.querySelectorAll("i").forEach(circle => {
            circle.addEventListener("click", () => {
                const day = circle.classList[2];
                self.setDay(day);
            });
        });

        // Add it to our row element
        const textElt = this.elt.querySelector(".itemText");
        textElt.insertAdjacentElement("afterbegin", days);
    }

    setDay(day) {
        this.item.day = day;
        this.changeCallback(this);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////

// Global variable that contains the active tab. Only used by the "Add" handler.
let activeTab;

class BasicTab {
    constructor(name) {
        this.name = name;

        // Save and add eventListeners to our tab label
        this.tab = document.getElementById(name + "-tab");
        this.tab.addEventListener("click", this.activate.bind(this));

        // Save our content element and initialize the buttons within
        this.list = document.getElementById(name + "-list");
        this.list.querySelector(".markAllCompleted").addEventListener("click", this.markAllCompleted.bind(this));
        this.list.querySelector(".clearCompleted").addEventListener("click", this.clearCompleted.bind(this));

        this.RowClass = BasicRow;
        this.rows = [];
    }

    initRowsFromStorage() {
        const items = JSON.parse(localStorage.getItem(this.name));
        if (!items) return;     // localStorage for this tab was empty
        for (const item of items) {
            this.createRow(item);
        }
    }

    activate() {
        document.querySelectorAll(".menu li").forEach(tab => {
            tab.classList.remove("activeTab");
        });
        document.querySelectorAll(".listWrapper").forEach(list => {
            list.classList.remove("activeWrapper");
            list.classList.add("hidden");
        });
        this.tab.classList.add("activeTab");
        this.list.classList.remove("hidden");
        this.list.classList.add("activeWrapper");
        activeTab = this;
        localStorage.setItem("activeTab", this.name);
    }

    markAllCompleted() {
        console.log(`markAllCompleted in ${this.name} tab`);
        for (const row of this.rows) {
            row.setDone(true);
        }
        this.save();
    }

    clearCompleted() {
        console.log(`clearCompleted in ${this.name} tab`);
        // TODO
    }

    placeRow(row) {
        this.list.querySelector(".list").appendChild(row.elt);
    }

    createRow(data) {
        const row = new this.RowClass(data, this.changed.bind(this));
        this.rows.push(row);
        this.placeRow(row);
    }

    addNewItem(text) {
        console.log(`Adding "${text}" in ${this.name} tab`);
        this.createRow(text);
        this.save();
    }

    changed(row) {
        console.log(`Changed in ${this.name} for`, row.item);
        this.save();
    }

    save() {
        localStorage.setItem(this.name, JSON.stringify(this.rows.map(r => r.item)));
    }
}

class PlannerTab extends BasicTab {
    constructor() {
        super(...arguments);
        this.RowClass = DayRow;
    }

    placeRow(row) {
        const day = row.item.day || "none";
        this.list.querySelector(`.list.${day}`).appendChild(row.elt);
    }

    changed(row) {
        console.log(`Changed in ${this.name} for`, row.item);
        this.placeRow(row);
        this.save();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
const tabs = {};
for (const t of ["shoppingList", "todoList", "cleaning"]) {
    tabs[t] = new BasicTab(t);
}
// Special tabs:
tabs.todoList.RowClass = PriorityRow;
tabs.menuPlanner = new PlannerTab("menuPlanner");

// Initialize the tabs with the stored data
for (const tab of Object.values(tabs)) {
    tab.initRowsFromStorage();
}

{
    const lastActive = localStorage.getItem("activeTab") || "shoppingList";
    console.log(`Activating ${lastActive} tab`);
    tabs[lastActive].activate();
}

document.getElementById("add-button").addEventListener("click", ev => {
    ev.preventDefault();
    const input = document.getElementById("item-to-add");
    activeTab.addNewItem(input.value);
    input.value = "";
});
