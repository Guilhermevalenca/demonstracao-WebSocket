<script lang="ts">
    import './app.css';
    import { socket } from '$lib';
    import { onMount } from "svelte";

    interface IMessage {
        name: string;
        message: string;
    }

    let message = $state<IMessage>({
        name: '',
        message: ''
    });
    let allMessages = $state<IMessage[]>([]);

    onMount(() => {
        socket.on('chat', (data: IMessage) => {
            allMessages.push(data);
        });

        socket.on('all-messages', (data: IMessage[]) => {
            allMessages = data;
            setTimeout(() => {
                const elementMessages = document.querySelector('.messages');
                if(elementMessages) {
                    elementMessages.scrollTop = elementMessages.scrollHeight;
                }
            }, 100);
        });

        socket.emit('all-messages');
    });

    async function submit() {
        if(message.message && message.name) {
            socket.emit('chat', message);
            message.message = '';
        }
    }
</script>

<main>
    <section>
        <div>
            <h1>Chat App in Sveltekit</h1>
        </div>
        <form on:submit|preventDefault={submit}>
            <label>
                Name
                <input type="text" bind:value={message.name} />
            </label>
            <label>
                Message
                <input type="text" bind:value={message.message} />
            </label>
            <button type="submit">Submit</button>
        </form>
    </section>
    {#if allMessages.length > 0}
        <section>
            <div class="messages">
                <ul>
                    {#each allMessages as message}
                        <li>
                            <strong>{ message.name }: </strong>
                            <span>{ message.message }</span>
                        </li>
                    {/each}
                </ul>
            </div>
        </section>
    {/if}
</main>