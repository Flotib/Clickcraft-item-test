var app = new Vue({
	el: '#app',
	data: {
		fps: 50,
		openBag: true,
		bagContainers: 5,
		itemGiverId: 0,
		selectedItem: {
				selection: false,
				item: [],
				slotId: null,
				target: null,
		},
		player: {
			type: 'playerInventory', //could be a seller or something else
			bag: [],
			equipment: [],
		},
		items: [
			{
				id: 1,
				name: 'un',
				equipable: true,
			},
			{
				id: 2,
				name: 'deux',
				equipable: false,
			},
			{
				id: 53,
				name: 'trois',
				equipable: true,
			},
		]
	},
	
	watch: {
		bagContainers: function (slots, oldslots) {
			this.changeSlots(this.player.bag, slots)
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
			let trueId = this.items.findIndex(item => item.id === id)
			if (trueId < 0) {
				return
			}
			let emptySlot = this.player.bag.findIndex(slot => slot.content === null)
			let oldslotId = this.player.bag[emptySlot].slotId
			target.splice(emptySlot, 1, {slotId: oldslotId, content: this.items[trueId]})
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
			if (this.player.bag[x-1].content != null) {
				this.player.bag.splice(x-1, 1, {slotId: x, content: null})
			}
		},

		itemSelection(item, slotId, target) {
			this.selectedItem.selection = true
			this.selectedItem.item.splice(0, 1, item)
			this.selectedItem.slotId = slotId
			this.selectedItem.target = target
		},

		equipItem(item, slot) {
			if (this.player.equipment.length != 0) {
				let actualItem = this.player.equipment[0]
				this.player.equipment.splice(0, 1, item)
				this.player.bag.splice(slot-1, 1, {slotId: slot, content: actualItem})
				
			} else {
				this.player.equipment.splice(0, 1, item)
				this.player.bag.splice(slot-1, 1, {slotId: slot, content: null})
			}
			this.unSelectItem()
		},

		unSelectItem() {
			this.selectedItem.selection = false,
			this.selectedItem.item.shift()
			this.selectedItem.slotId = null
			this.selectedItem.target = null
		},
	},

	mounted() {

		this.changeSlots(this.player.bag, this.bagContainers)

		setInterval(() => {

		}, 1000/this.fps)
	},
})