var app = new Vue({
	el: '#app',
	data: {
		fps: 50,
		openBag: false,
		bagContainers: 5,
		itemGiverId: 0,
		playerBag: [],
		playerEquipment: [],
		items: [
			{
				id: 1,
				name: 'un',
			},
			{
				id: 2,
				name: 'deux',
			},
			{
				id: 53,
				name: 'trois',
			},
		]
	},
	
	watch: {
		bagContainers: function (slots, oldslots) {
			this.changeSlots(this.playerBag, slots)
		},
	},

	computed: {
		
	},

	methods: {

		getItemName(id) {
			let g = this.items.findIndex(item => item.id === id)
			if (g >= 0 ) {
				return this.items[g].name
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
			let emptySlot = this.playerBag.findIndex(slot => slot.content === null)
			let oldslotId = this.playerBag[emptySlot].slotId
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
			if (this.playerBag[x-1].content != null) {
				this.playerBag.splice(x-1, 1, {slotId: x, content: null})
			}
		},
	},

	mounted() {
		
		this.changeSlots(this.playerBag, this.bagContainers)

		setInterval(() => {
		}, 1000/this.fps)
	},
})