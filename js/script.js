var app = new Vue({
	el: '#app',
	data: {
		fps: 50,
		openBag: true,
		itemGiverId: 0,
		selectedItem: {
				selection: false,
				item: [],
				slotId: null,
				target: null,
		},
		player: {
			type: 'player', //could be a seller or something else
			bag: {
				level: 1,
				bagSpace: 5,
				slots: [],
			},
			equipment: {
				item: [],
				slotId: 0,
			},
		},
		items: [
			{
				id: 1,
				name: 'One',
				equipable: true,
			},
			{
				id: 2,
				name: 'Two',
				equipable: false,
			},
			{
				id: 4,
				name: 'Three',
				equipable: true,
			},
		]
	},
	
	watch: {
		'player.bag.bagSpace': function (slots, oldslots) {
			this.changeSlots(this.player.bag.slots, slots)
		},
	},

	computed: {
		
	},

	methods: {

		getItemName(id) {
			let index = this.items.findIndex(item => item.id === id)
			if (index >= 0 ) {
				return this.items[index].name
			}
		},

		addItem(id, target) {
			if (this.emptySpace(target) <= 0) {
				return
			}
			let index = this.items.findIndex(item => item.id === id)
			if (index < 0) {
				return
			}
			let emptySlot = this.player.bag.slots.findIndex(slot => slot.content === null)
			let oldslotId = this.player.bag.slots[emptySlot].slotId
			target[emptySlot].slotId = oldslotId
			let item = JSON.parse(JSON.stringify(this.items))
			target[emptySlot].content = item[index]
		},

		changeSlots(target, slots) {
			if (target.length < slots) {
				target.push({slotId: target.length+1, content: null})
			} else if (target.length > slots) {
				target.pop()
			}

			if (slots != target.length) {
				this.changeSlots(target, slots)
			}
		},

		emptySpace(target) {
			let emptySlots = 0
			for(let i=0, l = target.length; i < l; i++){
				emptySlots += (target[i].content === null) ? 1 : 0;
			}
			return emptySlots
		},

		deleteItem(x) {
			if (this.player.bag.slots[x-1].content != null) {
				this.player.bag.slots.splice(x-1, 1, {slotId: x, content: null})
			}
		},

		itemSelection(item, slotId, target) {
			this.selectedItem.selection = true
			this.selectedItem.item.splice(0, 1, item)
			this.selectedItem.slotId = slotId
			this.selectedItem.target = target
		},

		equipItem(item, slot) {
			if (this.player.equipment.item.length != 0) {
				let actualItem = this.player.equipment.item[0]
				actualItem.equipable = true
				this.player.equipment.item.splice(0, 1, item)
				this.player.bag.slots.splice(slot-1, 1, {slotId: slot, content: actualItem})
				this.player.equipment.item[0].equipable = false
			} else {
				this.player.equipment.item.splice(0, 1, item)
				this.player.bag.slots.splice(slot-1, 1, {slotId: slot, content: null})
				this.player.equipment.item[0].equipable = false
			}
			this.unselectItem()
		},

		unequipItem() {
			let emptySlot = this.player.bag.slots.findIndex(slot => slot.content === null)
			let actualItem = this.player.equipment.item[0]
			actualItem.equipable = true
			this.player.equipment.item.splice(0, 1)
			this.player.bag.slots.splice(emptySlot, 1, {slotId: emptySlot+1, content: actualItem})
			this.unselectItem()
			console.log(this.player.equipment.item)
		},

		unselectItem() {
			this.selectedItem.selection = false,
			this.selectedItem.item.shift()
			this.selectedItem.slotId = null
			this.selectedItem.target = null
		},
	},

	mounted() {

		this.changeSlots(this.player.bag.slots, this.player.bag.bagSpace)

		setInterval(() => {

		}, 1000/this.fps)
	},
})