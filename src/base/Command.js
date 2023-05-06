/**
 * Estrutura dos comandos
 * @abstract
 */
class Command {
    /**
	 *
	 * @typedef CommandOption
	 * @property {string} name - The option's name
	 * @property {number} type - The option's type (use `Command.option_types`)
	 * @property {string} description - The option's description
	 * @property {CommandOption[]} [options] - The option's options
	 * @property {(string|number)[]} [choices] - The option's choices
	 * @property {boolean} required - Is this arg required? Defaults to `false`
	 */
	/**
	 * Create a new Command
	 * @param {import('../../').Bot} client - O client do Discord
	 * @param {string} name - O nome do comando (3-32)
	 * @param {string} description - A descrição do comando (1-100)
     * @param {string} usage - A forma de usar
	 * @param {boolean} staffOnly - Comando permitido apenas para equipe?
     * @param {number} cooldown - O delay para usar novamente.
	 * @param {string[]} [examples] - Exemplos de uso do comando
     * @param {string[]} [permissions] - Permissões necessárias para usar o comando
	 * @param {CommandOption[]} [options] - As opções do comando
	 */
    constructor(client, {
        name = '',
        description = '',
        usage = '',
        category = Command.category_types.OTHER,
        staffOnly = false,
        cooldown = 3000,
        examples = [],
        roles = [],
        options = []
    }) {
        this.client = client
        this.conf = {staffOnly, cooldown, roles, options}
        this.help = {name, description, examples, usage}
    }

    static get category_types() {
		return {
			OTHER: 1,
			STAFF: 2
		};
	}


}