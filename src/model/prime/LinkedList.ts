class ListNode<T> {
	public data: T;
	public next: ListNode<T> | null = null;

	constructor(public d: T) {
		this.data = d;
	}
}

export class LinkedList<T> {
	public head: ListNode<T> | null = null;
	public tail: ListNode<T> | null = null;
	public length = 0;

	public add(data: T): void {
		const node = new ListNode(data);

		if (!this.head) {
			this.head = node;
			this.tail = node;
		} else if (this.tail) {
			this.tail.next = node;
			this.tail = node;
		}
		this.length++;
	}

	public remove(data: T): void {
		let current = this.head;
		let previous = null;

		while (current) {
			if (current.data === data) {
				if (previous) {
					previous.next = current.next;
					if (current === this.tail) {
						this.tail = previous;
					}
				} else {
					this.head = current.next;
					if (current === this.tail) {
						this.tail = null;
					}
				}
				this.length--;
				return;
			}
			previous = current;
			current = current.next;
		}
	}

	public clear(): void {
		this.head = null;
		this.tail = null;
		this.length = 0;
	}

	public print(): void {
		let current = this.head;
		while (current) {
			console.log(`${current.data} -> `);
			current = current.next;
		}
	}

	public forEach(callback: (data: T) => void): void {
		let current = this.head;
		while (current) {
			callback(current.data);
			current = current.next;
		}
	}

	public toArray(): T[] {
		const arr: T[] = [];
		let current = this.head;
		while (current) {
			arr.push(current.data);
			current = current.next;
		}
		return arr;
	}

	public enqueue(data: T): void {
		this.add(data);
	}

	public dequeue(): T | null {
		if (this.head) {
			const data = this.head.data;
			this.head = this.head.next;
			this.length--;
			return data;
		}
		return null;
	}
}
