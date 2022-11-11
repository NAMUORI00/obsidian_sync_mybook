'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

// DEPRECATED
class DecryptModal extends obsidian.Modal {
    constructor(app, title, text = '', showCopyButton) {
        super(app);
        this.decryptInPlace = false;
        this.text = text;
        this.titleEl.innerText = title;
        this.showCopyButton = showCopyButton;
    }
    onOpen() {
        let { contentEl } = this;
        const textEl = contentEl.createDiv().createEl('textarea', { text: this.text });
        textEl.style.width = '100%';
        textEl.style.height = '100%';
        textEl.rows = 10;
        textEl.readOnly = true;
        //textEl.focus(); // Doesn't seem to work here...
        setTimeout(() => { textEl.focus(); }, 100); //... but this does
        const btnContainerEl = contentEl.createDiv('');
        if (this.showCopyButton) {
            const copyBtnEl = btnContainerEl.createEl('button', { text: 'Copy' });
            copyBtnEl.addEventListener('click', () => {
                navigator.clipboard.writeText(textEl.value);
            });
        }
        const decryptInPlaceBtnEl = btnContainerEl.createEl('button', { text: 'Decrypt in-place' });
        decryptInPlaceBtnEl.addEventListener('click', () => {
            this.decryptInPlace = true;
            this.close();
        });
        const cancelBtnEl = btnContainerEl.createEl('button', { text: 'Close' });
        cancelBtnEl.addEventListener('click', () => {
            this.close();
        });
    }
}

// DEPRECATED
class PasswordModal extends obsidian.Modal {
    constructor(app, isEncrypting, confirmPassword, defaultPassword = null, hint) {
        super(app);
        this.password = null;
        this.hint = null;
        this.defaultPassword = null;
        this.defaultPassword = defaultPassword;
        this.confirmPassword = confirmPassword;
        this.isEncrypting = isEncrypting;
        this.hint = hint;
    }
    onOpen() {
        var _a, _b, _c;
        let { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('meld-e-password');
        if (obsidian.Platform.isMobile) {
            contentEl.addClass('meld-e-platform-mobile');
        }
        else if (obsidian.Platform.isDesktop) {
            contentEl.addClass('meld-e-platform-desktop');
        }
        /* Main password input row */
        const inputPwContainerEl = contentEl.createDiv({ cls: 'meld-e-row' });
        inputPwContainerEl.createSpan({ cls: 'meld-e-icon', text: '🔑' });
        const pwInputEl = inputPwContainerEl.createEl('input', { type: 'password', value: (_a = this.defaultPassword) !== null && _a !== void 0 ? _a : '' });
        pwInputEl.placeholder = 'Enter your password';
        pwInputEl.focus();
        if (obsidian.Platform.isMobile) {
            // Add 'Next' button for mobile
            const inputInputNextBtnEl = inputPwContainerEl.createEl('button', {
                text: '→',
                cls: 'meld-e-button-next'
            });
            inputInputNextBtnEl.addEventListener('click', (ev) => {
                inputPasswordHandler();
            });
        }
        /* End Main password input row */
        /* Confirm password input row */
        const confirmPwShown = this.confirmPassword;
        const confirmPwContainerEl = contentEl.createDiv({ cls: 'meld-e-row' });
        confirmPwContainerEl.createSpan({ cls: 'meld-e-icon', text: '🔑' });
        const pwConfirmInputEl = confirmPwContainerEl.createEl('input', {
            type: 'password',
            value: (_b = this.defaultPassword) !== null && _b !== void 0 ? _b : ''
        });
        pwConfirmInputEl.placeholder = 'Confirm your password';
        const messageEl = contentEl.createDiv({ cls: 'meld-e-message' });
        messageEl.hide();
        if (obsidian.Platform.isMobile) {
            // Add 'Next' button for mobile
            const confirmInputNextBtnEl = confirmPwContainerEl.createEl('button', {
                text: '→',
                cls: 'meld-e-button-next'
            });
            confirmInputNextBtnEl.addEventListener('click', (ev) => {
                confirmPasswordHandler();
            });
        }
        if (!confirmPwShown) {
            confirmPwContainerEl.hide();
        }
        /* End Confirm password input row */
        /* Hint input row */
        const hintInputShown = this.isEncrypting;
        const inputHintContainerEl = contentEl.createDiv({ cls: 'meld-e-row' });
        inputHintContainerEl.createSpan({ cls: 'meld-e-icon', text: '💡' });
        const hintInputEl = inputHintContainerEl.createEl('input', { type: 'text', value: this.hint });
        hintInputEl.placeholder = 'Enter an optional password hint';
        if (obsidian.Platform.isMobile) {
            // Add 'Next' button for mobile
            const hintInputNextBtnEl = inputHintContainerEl.createEl('button', {
                text: '→',
                cls: 'meld-e-button-next'
            });
            hintInputNextBtnEl.addEventListener('click', (ev) => {
                hintPasswordHandler();
            });
        }
        if (!hintInputShown) {
            inputHintContainerEl.hide();
        }
        /* End Hint input row */
        /* Hint text row */
        const spanHintContainerEl = contentEl.createDiv({ cls: 'meld-e-row' });
        spanHintContainerEl.createSpan({ cls: 'meld-e-icon', text: '💡' });
        spanHintContainerEl.createSpan({ cls: 'meld-e-hint', text: `Hint: '${this.hint}'` });
        if (hintInputShown || ((_c = this.hint) !== null && _c !== void 0 ? _c : '').length == 0) {
            spanHintContainerEl.hide();
        }
        /* END Hint text row */
        const confirmPwButtonEl = contentEl.createEl('button', {
            text: 'Confirm',
            cls: 'meld-e-button-confirm'
        });
        confirmPwButtonEl.addEventListener('click', (ev) => {
            if (validate()) {
                this.close();
            }
            else {
                pwInputEl.focus();
            }
        });
        const validate = () => {
            if (confirmPwShown) {
                if (pwInputEl.value != pwConfirmInputEl.value) {
                    // passwords don't match
                    messageEl.setText('Passwords don\'t match');
                    messageEl.show();
                    return false;
                }
            }
            this.password = pwInputEl.value;
            this.hint = hintInputEl.value;
            return true;
        };
        const inputPasswordHandler = () => {
            if (confirmPwShown) {
                pwConfirmInputEl.focus();
                return;
            }
            if (hintInputShown) {
                hintInputEl.focus();
                return;
            }
            if (validate()) {
                this.close();
            }
        };
        const confirmPasswordHandler = () => {
            if (validate()) {
                if (hintInputShown) {
                    hintInputEl.focus();
                }
                else {
                    this.close();
                }
            }
        };
        const hintPasswordHandler = () => {
            if (validate()) {
                this.close();
            }
            else {
                pwInputEl.focus();
            }
        };
        hintInputEl.addEventListener('keypress', (ev) => {
            if ((ev.code === 'Enter' || ev.code === 'NumpadEnter')
                && pwInputEl.value.length > 0) {
                ev.preventDefault();
                hintPasswordHandler();
            }
        });
        pwConfirmInputEl.addEventListener('keypress', (ev) => {
            if ((ev.code === 'Enter' || ev.code === 'NumpadEnter')
                && pwConfirmInputEl.value.length > 0) {
                ev.preventDefault();
                confirmPasswordHandler();
            }
        });
        pwInputEl.addEventListener('keypress', (ev) => {
            if ((ev.code === 'Enter' || ev.code === 'NumpadEnter')
                && pwInputEl.value.length > 0) {
                ev.preventDefault();
                inputPasswordHandler();
            }
        });
    }
}

const vectorSize = 16;
const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();
const iterations = 1000;
const salt = utf8Encoder.encode('XHWnDAT6ehMVY2zD');
class CryptoHelperV2 {
    deriveKey(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = utf8Encoder.encode(password);
            const key = yield crypto.subtle.importKey('raw', buffer, { name: 'PBKDF2' }, false, ['deriveKey']);
            const privateKey = crypto.subtle.deriveKey({
                name: 'PBKDF2',
                hash: { name: 'SHA-256' },
                iterations,
                salt
            }, key, {
                name: 'AES-GCM',
                length: 256
            }, false, ['encrypt', 'decrypt']);
            return privateKey;
        });
    }
    encryptToBytes(text, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.deriveKey(password);
            const textBytesToEncrypt = utf8Encoder.encode(text);
            const vector = crypto.getRandomValues(new Uint8Array(vectorSize));
            // encrypt into bytes
            const encryptedBytes = new Uint8Array(yield crypto.subtle.encrypt({ name: 'AES-GCM', iv: vector }, key, textBytesToEncrypt));
            const finalBytes = new Uint8Array(vector.byteLength + encryptedBytes.byteLength);
            finalBytes.set(vector, 0);
            finalBytes.set(encryptedBytes, vector.byteLength);
            return finalBytes;
        });
    }
    convertToString(bytes) {
        let result = '';
        for (let idx = 0; idx < bytes.length; idx++) {
            // append to result
            result += String.fromCharCode(bytes[idx]);
        }
        return result;
    }
    encryptToBase64(text, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const finalBytes = yield this.encryptToBytes(text, password);
            //convert array to base64
            const base64Text = btoa(this.convertToString(finalBytes));
            return base64Text;
        });
    }
    stringToArray(str) {
        var result = [];
        for (var i = 0; i < str.length; i++) {
            result.push(str.charCodeAt(i));
        }
        return new Uint8Array(result);
    }
    decryptFromBytes(encryptedBytes, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // extract iv
                const vector = encryptedBytes.slice(0, vectorSize);
                // extract encrypted text
                const encryptedTextBytes = encryptedBytes.slice(vectorSize);
                const key = yield this.deriveKey(password);
                // decrypt into bytes
                let decryptedBytes = yield crypto.subtle.decrypt({ name: 'AES-GCM', iv: vector }, key, encryptedTextBytes);
                // convert bytes to text
                let decryptedText = utf8Decoder.decode(decryptedBytes);
                return decryptedText;
            }
            catch (e) {
                //console.error(e);
                return null;
            }
        });
    }
    decryptFromBase64(base64Encoded, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let bytesToDecode = this.stringToArray(atob(base64Encoded));
                return yield this.decryptFromBytes(bytesToDecode, password);
                // // extract iv
                // const vector = bytesToDecode.slice(0,vectorSize);
                // // extract encrypted text
                // const encryptedTextBytes = bytesToDecode.slice(vectorSize);
                // const key = await this.deriveKey(password);
                // // decrypt into bytes
                // let decryptedBytes = await crypto.subtle.decrypt(
                // 	{name: 'AES-GCM', iv: vector},
                // 	key,
                // 	encryptedTextBytes
                // );
                // // convert bytes to text
                // let decryptedText = utf8Decoder.decode(decryptedBytes);
                // return decryptedText;
            }
            catch (e) {
                //console.error(e);
                return null;
            }
        });
    }
}
const algorithmObsolete = {
    name: 'AES-GCM',
    iv: new Uint8Array([196, 190, 240, 190, 188, 78, 41, 132, 15, 220, 84, 211]),
    tagLength: 128
};
class CryptoHelperObsolete {
    buildKey(password) {
        return __awaiter(this, void 0, void 0, function* () {
            let utf8Encode = new TextEncoder();
            let passwordBytes = utf8Encode.encode(password);
            let passwordDigest = yield crypto.subtle.digest({ name: 'SHA-256' }, passwordBytes);
            let key = yield crypto.subtle.importKey('raw', passwordDigest, algorithmObsolete, false, ['encrypt', 'decrypt']);
            return key;
        });
    }
    encryptToBase64(text, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let key = yield this.buildKey(password);
            let utf8Encode = new TextEncoder();
            let bytesToEncrypt = utf8Encode.encode(text);
            // encrypt into bytes
            let encryptedBytes = new Uint8Array(yield crypto.subtle.encrypt(algorithmObsolete, key, bytesToEncrypt));
            //convert array to base64
            let base64Text = btoa(String.fromCharCode(...encryptedBytes));
            return base64Text;
        });
    }
    stringToArray(str) {
        var result = [];
        for (var i = 0; i < str.length; i++) {
            result.push(str.charCodeAt(i));
        }
        return new Uint8Array(result);
    }
    decryptFromBase64(base64Encoded, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // convert base 64 to array
                let bytesToDecrypt = this.stringToArray(atob(base64Encoded));
                let key = yield this.buildKey(password);
                // decrypt into bytes
                let decryptedBytes = yield crypto.subtle.decrypt(algorithmObsolete, key, bytesToDecrypt);
                // convert bytes to text
                let utf8Decode = new TextDecoder();
                let decryptedText = utf8Decode.decode(decryptedBytes);
                return decryptedText;
            }
            catch (e) {
                return null;
            }
        });
    }
}

class MeldEncryptSettingsTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h1', { text: 'Settings for Meld Encrypt' });
        new obsidian.Setting(containerEl)
            .setName('Add ribbon icon to create note')
            .setDesc('Adds a ribbon icon to the left bar to create an encrypted note.')
            .addToggle(toggle => {
            toggle.setValue(this.plugin.settings.addRibbonIconToCreateNote)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.addRibbonIconToCreateNote = value;
                yield this.plugin.saveSettings();
            }));
        });
        containerEl.createEl('hr');
        containerEl.createEl('h2', { text: 'Deprecated Settings' });
        // DEPRECATED below
        new obsidian.Setting(containerEl)
            .setName('Expand selection to whole line?')
            .setDesc('Partial selections will get expanded to the whole line.')
            .addToggle(toggle => {
            toggle
                .setValue(this.plugin.settings.expandToWholeLines)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.expandToWholeLines = value;
                yield this.plugin.saveSettings();
                //this.updateSettingsUi();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName('Confirm password?')
            .setDesc('Confirm password when encrypting.')
            .addToggle(toggle => {
            toggle
                .setValue(this.plugin.settings.confirmPassword)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.confirmPassword = value;
                yield this.plugin.saveSettings();
                this.updateSettingsUi();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName('Copy button?')
            .setDesc('Show a button to copy decrypted text.')
            .addToggle(toggle => {
            toggle
                .setValue(this.plugin.settings.showCopyButton)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.showCopyButton = value;
                yield this.plugin.saveSettings();
                this.updateSettingsUi();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName('Remember password?')
            .setDesc('Remember the last used password for this session.')
            .addToggle(toggle => {
            toggle
                .setValue(this.plugin.settings.rememberPassword)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.rememberPassword = value;
                yield this.plugin.saveSettings();
                this.updateSettingsUi();
            }));
        });
        this.pwTimeoutSetting = new obsidian.Setting(containerEl)
            .setName(this.buildPasswordTimeoutSettingName())
            .setDesc('The number of minutes to remember the last used password.')
            .addSlider(slider => {
            slider
                .setLimits(0, 120, 5)
                .setValue(this.plugin.settings.rememberPasswordTimeout)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.rememberPasswordTimeout = value;
                yield this.plugin.saveSettings();
                this.updateSettingsUi();
            }));
        });
        this.updateSettingsUi();
    }
    updateSettingsUi() {
        this.pwTimeoutSetting.setName(this.buildPasswordTimeoutSettingName());
        if (this.plugin.settings.rememberPassword) {
            this.pwTimeoutSetting.settingEl.show();
        }
        else {
            this.pwTimeoutSetting.settingEl.hide();
        }
    }
    buildPasswordTimeoutSettingName() {
        const value = this.plugin.settings.rememberPasswordTimeout;
        let timeoutString = `${value} minutes`;
        if (value == 0) {
            timeoutString = 'Never forget';
        }
        return `Remember Password Timeout (${timeoutString})`;
    }
}

var EncryptedFileContentViewStateEnum;
(function (EncryptedFileContentViewStateEnum) {
    EncryptedFileContentViewStateEnum[EncryptedFileContentViewStateEnum["init"] = 0] = "init";
    EncryptedFileContentViewStateEnum[EncryptedFileContentViewStateEnum["decryptNote"] = 1] = "decryptNote";
    EncryptedFileContentViewStateEnum[EncryptedFileContentViewStateEnum["editNote"] = 2] = "editNote";
    EncryptedFileContentViewStateEnum[EncryptedFileContentViewStateEnum["changePassword"] = 3] = "changePassword";
    EncryptedFileContentViewStateEnum[EncryptedFileContentViewStateEnum["newNote"] = 4] = "newNote";
})(EncryptedFileContentViewStateEnum || (EncryptedFileContentViewStateEnum = {}));
const VIEW_TYPE_ENCRYPTED_FILE_CONTENT = "meld-encrypted-file-content-view";
class EncryptedFileContentView extends obsidian.TextFileView {
    constructor(leaf) {
        super(leaf);
        // State
        this.currentView = EncryptedFileContentViewStateEnum.init;
        this.encryptionPassword = '';
        this.hint = '';
        this.currentEditorText = '';
        console.debug('EncryptedFileContentView.constructor', { leaf });
        this.elActionIconLockNote = this.addAction('lock', 'Lock', () => this.actionLockFile());
        this.elActionChangePassword = this.addAction('key', 'Change Password', () => this.actionChangePassword());
        this.contentEl.style.display = 'flex';
        this.contentEl.style.flexDirection = 'column';
        this.contentEl.style.alignItems = 'center';
    }
    actionLockFile() {
        this.encryptionPassword = '';
        this.refreshView(EncryptedFileContentViewStateEnum.decryptNote);
    }
    actionChangePassword() {
        this.refreshView(EncryptedFileContentViewStateEnum.changePassword);
    }
    onPaneMenu(menu, source) {
        console.debug({ menu, source, 'view': this.currentView });
        if (source == 'tab-header' && this.currentView == EncryptedFileContentViewStateEnum.editNote) {
            menu.addItem(m => {
                m
                    .setSection('action')
                    .setIcon('lock')
                    .setTitle('Lock')
                    .onClick(() => this.actionLockFile());
            });
            menu.addItem(m => {
                m
                    .setSection('action')
                    .setIcon('key')
                    .setTitle('Change Password')
                    .onClick(() => this.actionChangePassword());
            });
        }
        super.onPaneMenu(menu, source);
    }
    createTitle(title) {
        return this.contentEl.createDiv({
            text: `🔐 ${title} 🔐`,
            attr: {
                style: 'margin-bottom:2em;'
            }
        });
    }
    validatePassword(pw) {
        if (pw.length == 0) {
            return 'Password is too short';
        }
        return '';
    }
    validateConfirm(pw, cpw) {
        const passwordMatch = pw === cpw;
        return passwordMatch ? '' : 'Password doesn\'t match';
    }
    createNewNoteView() {
        //console.debug('createDecryptNoteView', { "hint": this.hint} );
        const container = this.createInputContainer();
        new obsidian.Setting(container)
            .setDesc('Please provide a password and hint to start editing this note.');
        const submit = (password, confirm, hint) => __awaiter(this, void 0, void 0, function* () {
            var validPw = this.validatePassword(password);
            var validCpw = this.validateConfirm(password, confirm);
            sPassword.setDesc(validPw);
            sConfirm.setDesc(validCpw);
            if (validPw.length === 0 && validCpw.length === 0) {
                //set password and hint and open note
                this.encryptionPassword = password;
                this.hint = hint;
                this.currentEditorText = this.file.basename;
                yield this.encodeAndSave();
                this.refreshView(EncryptedFileContentViewStateEnum.editNote);
            }
        });
        let password = '';
        let confirm = '';
        let hint = '';
        const sPassword = new obsidian.Setting(container)
            .setName("Password:")
            .setDesc('')
            .addText(tc => {
            tc.inputEl.focus();
            tc.inputEl.type = 'password';
            tc.onChange(v => {
                password = v;
                sPassword.setDesc(this.validatePassword(password));
                sConfirm.setDesc(this.validateConfirm(password, confirm));
            });
        });
        sPassword.controlEl.on('keydown', '*', (ev) => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                // validate password
                if (password.length > 0) {
                    sConfirm.controlEl.querySelector('input').focus();
                }
            }
        });
        const sConfirm = new obsidian.Setting(container)
            .setName("Confirm:")
            .setDesc('')
            .addText(tc => {
            tc.inputEl.type = 'password';
            tc.onChange(v => {
                confirm = v;
                sPassword.setDesc(this.validatePassword(password));
                sConfirm.setDesc(this.validateConfirm(password, confirm));
            });
        });
        sConfirm.controlEl.on('keydown', '*', (ev) => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                // validate confirm
                const passwordMatch = password === confirm;
                if (passwordMatch) {
                    sHint.controlEl.querySelector('input').focus();
                }
            }
        });
        const sHint = new obsidian.Setting(container)
            .setName("Hint:")
            .addText((tc) => {
            tc.onChange(v => {
                hint = v;
            });
        });
        sHint.controlEl.on('keydown', '*', (ev) => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                submit(password, confirm, hint);
            }
        });
        new obsidian.Setting(container)
            .addButton(bc => {
            bc
                .setCta()
                .setIcon('go-to-file')
                .setTooltip('Edit')
                .onClick((ev) => submit(password, confirm, hint));
        });
        return container;
    }
    createDecryptNoteView() {
        const container = this.createInputContainer();
        new obsidian.Setting(container)
            .setDesc('Please provide a password to unlock this note.');
        new obsidian.Setting(container)
            .setName("Password:")
            .addText((tc) => {
            tc.inputEl.type = 'password';
            tc.inputEl.focus();
            tc.setValue(this.encryptionPassword);
            tc.setPlaceholder(this.formatHint(this.hint));
            tc.onChange((value) => {
                this.encryptionPassword = value;
            });
            tc.inputEl.onkeydown = (ev) => __awaiter(this, void 0, void 0, function* () {
                if (ev.key === 'Enter') {
                    ev.preventDefault();
                    yield this.handleDecryptButtonClick();
                }
            });
        });
        new obsidian.Setting(container)
            .addButton(bc => {
            bc
                .setCta()
                .setIcon('checkmark')
                .setTooltip('Unlock & Edit')
                .onClick((evt) => this.handleDecryptButtonClick());
        });
        return container;
    }
    encodeAndSave() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.debug('encodeAndSave');
                var fileData = yield FileDataHelper.encode(this.encryptionPassword, this.hint, this.currentEditorText);
                this.data = JsonFileEncoding.encode(fileData);
                this.requestSave();
            }
            catch (e) {
                console.error(e);
                new obsidian.Notice(e, 10000);
            }
        });
    }
    createEditorView() {
        //const container = this.contentEl.createEl('textarea');
        const container = this.contentEl.createDiv();
        container.contentEditable = 'true';
        container.style.flexGrow = '1';
        container.style.alignSelf = 'stretch';
        //container.value = this.currentEditorText
        container.innerText = this.currentEditorText;
        container.focus();
        container.on('input', '*', (ev, target) => __awaiter(this, void 0, void 0, function* () {
            console.debug('editor input', { ev, target });
            //this.currentEditorText = container.value;
            this.currentEditorText = container.innerText;
            yield this.encodeAndSave();
        }));
        return container;
    }
    createInputContainer() {
        return this.contentEl.createDiv({
            'attr': {
                'style': 'width:100%; max-width:400px;'
            }
        });
    }
    createChangePasswordView() {
        const container = this.createInputContainer();
        let newPassword = '';
        let confirm = '';
        let newHint = '';
        const submit = (newPassword, confirm, newHint) => __awaiter(this, void 0, void 0, function* () {
            var validPw = this.validatePassword(newPassword);
            var validCpw = this.validateConfirm(newPassword, confirm);
            sNewPassword.setDesc(validPw);
            sConfirm.setDesc(validCpw);
            if (validPw.length === 0 && validCpw.length === 0) {
                //set password and hint and open note
                console.debug('createChangePasswordView submit');
                this.encryptionPassword = newPassword;
                this.hint = newHint;
                this.encodeAndSave();
                this.refreshView(EncryptedFileContentViewStateEnum.editNote);
                new obsidian.Notice('Password and Hint were changed');
            }
        });
        const sNewPassword = new obsidian.Setting(container)
            .setName("New Password:")
            .setDesc('')
            .addText(tc => {
            tc.inputEl.type = 'password';
            tc.inputEl.focus();
            tc.onChange(v => {
                newPassword = v;
                sNewPassword.setDesc(this.validatePassword(newPassword));
                sConfirm.setDesc(this.validateConfirm(newPassword, confirm));
            });
        });
        sNewPassword.controlEl.on('keydown', '*', (ev) => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                // validate password
                if (newPassword.length > 0) {
                    sConfirm.controlEl.querySelector('input').focus();
                }
            }
        });
        const sConfirm = new obsidian.Setting(container)
            .setName("Confirm:")
            .setDesc('')
            .addText(tc => {
            tc.inputEl.type = 'password';
            tc.onChange(v => {
                confirm = v;
                sNewPassword.setDesc(this.validatePassword(newPassword));
                sConfirm.setDesc(this.validateConfirm(newPassword, confirm));
            });
        });
        sConfirm.controlEl.on('keydown', '*', (ev) => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                // validate confirm
                const passwordMatch = newPassword === confirm;
                if (passwordMatch) {
                    sHint.controlEl.querySelector('input').focus();
                }
            }
        });
        const sHint = new obsidian.Setting(container)
            .setName("New Hint:")
            .addText((tc) => {
            tc.onChange(v => {
                newHint = v;
            });
        });
        sHint.controlEl.on('keydown', '*', (ev) => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                submit(newPassword, confirm, newHint);
            }
        });
        new obsidian.Setting(container)
            .addButton(bc => {
            bc
                .removeCta()
                .setIcon('cross')
                //.setButtonText('Cancel')
                .setTooltip('Cancel')
                .onClick(() => {
                this.refreshView(EncryptedFileContentViewStateEnum.editNote);
            });
        }).addButton(bc => {
            bc
                .setCta()
                .setIcon('checkmark')
                .setTooltip('Change Password')
                //.setButtonText('Change Password')
                .setWarning()
                .onClick((ev) => {
                submit(newPassword, confirm, newHint);
            });
        });
        return container;
    }
    formatHint(hint) {
        if (hint.length > 0) {
            return `Hint: ${hint}`;
        }
        else {
            return '';
        }
    }
    refreshView(newView) {
        console.debug('refreshView', { 'currentView': this.currentView, newView });
        this.elActionIconLockNote.hide();
        this.elActionChangePassword.hide();
        // clear view
        this.contentEl.empty();
        this.currentView = newView;
        switch (this.currentView) {
            case EncryptedFileContentViewStateEnum.newNote:
                this.createTitle('This note will be encrypted');
                this.createNewNoteView();
                break;
            case EncryptedFileContentViewStateEnum.decryptNote:
                this.createTitle('This note is encrypted');
                this.createDecryptNoteView();
                break;
            case EncryptedFileContentViewStateEnum.editNote:
                this.elActionIconLockNote.show();
                this.elActionChangePassword.show();
                this.createTitle('This note is encrypted');
                this.createEditorView();
                break;
            case EncryptedFileContentViewStateEnum.changePassword:
                this.createTitle('Change encrypted note password');
                this.createChangePasswordView();
                break;
        }
    }
    handleDecryptButtonClick() {
        return __awaiter(this, void 0, void 0, function* () {
            var fileData = JsonFileEncoding.decode(this.data);
            console.debug('Decrypt button', fileData);
            const decryptedText = yield FileDataHelper.decrypt(fileData, this.encryptionPassword);
            if (decryptedText === null) {
                new obsidian.Notice('Decryption failed');
            }
            else {
                //this.currentView = EncryptedFileContentViewStateEnum.editNote;
                this.currentEditorText = decryptedText;
                this.refreshView(EncryptedFileContentViewStateEnum.editNote);
            }
        });
    }
    // important
    canAcceptExtension(extension) {
        console.debug('EncryptedFileContentView.canAcceptExtension', { extension });
        return extension == 'encrypted';
    }
    // important
    getViewType() {
        return VIEW_TYPE_ENCRYPTED_FILE_CONTENT;
    }
    // the data to show on the view
    setViewData(data, clear) {
        console.debug('EncryptedFileContentView.setViewData', {
            data,
            clear,
            'pass': this.encryptionPassword,
            //'mode':this.getMode(),
            //'mode-data':this.currentMode.get(),
            //'preview-mode-data':this.previewMode.get()
        });
        if (clear) {
            var newView;
            if (data === '') {
                // blank new file
                newView = EncryptedFileContentViewStateEnum.newNote;
            }
            else {
                newView = EncryptedFileContentViewStateEnum.decryptNote;
            }
            // new file, we don't know what the password is yet
            this.encryptionPassword = '';
            // json decode file data to get the Hint
            var fileData = JsonFileEncoding.decode(this.data);
            this.hint = fileData.hint;
            this.refreshView(newView);
        }
        else {
            this.leaf.detach();
            new obsidian.Notice('Multiple views of the same encrypted note isn\'t supported');
        }
    }
    // the data to save to disk
    getViewData() {
        console.debug('EncryptedFileContentView.getViewData', {
            'this': this,
            'data': this.data,
        });
        return this.data;
    }
    clear() {
        console.debug('EncryptedFileContentView.clear');
    }
}
class FileData {
    constructor(hint, encodedData) {
        this.version = "1.0";
        this.hint = hint;
        this.encodedData = encodedData;
    }
}
class FileDataHelper {
    static encode(pass, hint, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const crypto = new CryptoHelperV2();
            const encryptedData = yield crypto.encryptToBase64(text, pass);
            return new FileData(hint, encryptedData);
        });
    }
    static decrypt(data, pass) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.encodedData == '') {
                return '';
            }
            const crypto = new CryptoHelperV2();
            return yield crypto.decryptFromBase64(data.encodedData, pass);
        });
    }
}
class JsonFileEncoding {
    static encode(data) {
        return JSON.stringify(data, null, 2);
    }
    static decode(encodedText) {
        console.debug('JsonFileEncoding.decode', { encodedText });
        if (encodedText === '') {
            return new FileData("", "");
        }
        return JSON.parse(encodedText);
    }
}

// DEPRECATED below
const _PREFIX = '%%🔐';
const _PREFIX_OBSOLETE = _PREFIX + ' ';
const _PREFIX_A = _PREFIX + 'α ';
const _SUFFIX = ' 🔐%%';
const _HINT = '💡';
const DEFAULT_SETTINGS = {
    addRibbonIconToCreateNote: true,
    // DEPRECATED below
    expandToWholeLines: true,
    confirmPassword: true,
    showCopyButton: true,
    rememberPassword: true,
    rememberPasswordTimeout: 30
};
class MeldEncrypt extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            this.updateUiForSettings();
            this.addSettingTab(new MeldEncryptSettingsTab(this.app, this));
            this.registerView(VIEW_TYPE_ENCRYPTED_FILE_CONTENT, (leaf) => new EncryptedFileContentView(leaf));
            this.registerExtensions(['encrypted'], VIEW_TYPE_ENCRYPTED_FILE_CONTENT);
            this.addCommand({
                id: 'meld-encrypt-create-new-note',
                name: 'Create new encrypted note',
                checkCallback: (checking) => this.processCreateNewEncryptedNoteCommand(checking)
            });
            // DEPRECATED below
            this.addCommand({
                id: 'meld-encrypt',
                name: 'DEPRECATED - Encrypt/Decrypt',
                editorCheckCallback: (checking, editor, view) => this.deprecatedProcessEncryptDecryptCommand(checking, editor, view, false)
            });
            this.addCommand({
                id: 'meld-encrypt-in-place',
                name: 'DEPRECATED - Encrypt/Decrypt In-place',
                editorCheckCallback: (checking, editor, view) => this.deprecatedProcessEncryptDecryptCommand(checking, editor, view, true)
            });
            this.addCommand({
                id: 'meld-encrypt-note',
                name: 'DEPRECATED - Encrypt/Decrypt Whole Note',
                editorCheckCallback: (checking, editor, view) => this.deprecatedProcessEncryptDecryptWholeNoteCommand(checking, editor, view)
            });
            // DEPRECATED above
        });
    }
    onunload() {
        this.app.workspace.detachLeavesOfType(VIEW_TYPE_ENCRYPTED_FILE_CONTENT);
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
            this.updateUiForSettings();
        });
    }
    updateUiForSettings() {
        if (this.settings.addRibbonIconToCreateNote) {
            // turn on ribbon icon
            if (this.ribbonIconCreateNewNote == null) {
                this.ribbonIconCreateNewNote = this.addRibbonIcon('lock', 'Create new encrypted note', (ev) => {
                    this.processCreateNewEncryptedNoteCommand(false);
                });
            }
        }
        else {
            // turn off ribbon icon
            if (this.ribbonIconCreateNewNote != null) {
                this.ribbonIconCreateNewNote.remove();
                this.ribbonIconCreateNewNote = null;
            }
        }
    }
    isSettingsModalOpen() {
        return document.querySelector('.mod-settings') !== null;
    }
    processCreateNewEncryptedNoteCommand(checking) {
        console.debug('processCreateNewEncryptedNoteCommand', { checking });
        try {
            if (checking) {
                return true;
            }
            let newFilename = obsidian.moment().format('[Untitled] YYYYMMDD hhmmss[.encrypted]');
            let newFileFolder;
            const activeFile = this.app.workspace.getActiveFile();
            if (activeFile != null) {
                newFileFolder = this.app.fileManager.getNewFileParent(activeFile.path);
            }
            else {
                newFileFolder = this.app.fileManager.getNewFileParent('');
            }
            const newFilepath = obsidian.normalizePath(newFileFolder.path + "/" + newFilename);
            console.debug('processCreateNewEncryptedNoteCommand', { newFilepath });
            this.app.vault.create(newFilepath, '').then(f => {
                const leaf = this.app.workspace.getLeaf(false);
                leaf.openFile(f);
            }).catch(reason => {
                new obsidian.Notice(reason, 10000);
            });
            return true;
        }
        catch (e) {
            console.error(e);
            new obsidian.Notice(e, 10000);
        }
    }
    // DEPRECATED below
    deprecatedProcessEncryptDecryptWholeNoteCommand(checking, editor, view) {
        if (checking && this.isSettingsModalOpen()) {
            // Settings is open, ensures this command can show up in other
            // plugins which list commands e.g. customizable-sidebar
            return true;
        }
        const startPos = editor.offsetToPos(0);
        const endPos = { line: editor.lastLine(), ch: editor.getLine(editor.lastLine()).length };
        const selectionText = editor.getRange(startPos, endPos).trim();
        return this.processSelection(checking, editor, selectionText, startPos, endPos, true);
    }
    deprecatedProcessEncryptDecryptCommand(checking, editor, view, decryptInPlace) {
        if (checking && this.isSettingsModalOpen()) {
            // Settings is open, ensures this command can show up in other
            // plugins which list commands e.g. customizable-sidebar
            return true;
        }
        let startPos = editor.getCursor('from');
        let endPos = editor.getCursor('to');
        if (this.settings.expandToWholeLines) {
            const startLine = startPos.line;
            startPos = { line: startLine, ch: 0 }; // want the start of the first line
            const endLine = endPos.line;
            const endLineText = editor.getLine(endLine);
            endPos = { line: endLine, ch: endLineText.length }; // want the end of last line
        }
        else {
            if (!editor.somethingSelected()) {
                // nothing selected, assume user wants to decrypt, expand to start and end markers
                startPos = this.getClosestPrevTextCursorPos(editor, _PREFIX, startPos);
                endPos = this.getClosestNextTextCursorPos(editor, _SUFFIX, endPos);
            }
        }
        const selectionText = editor.getRange(startPos, endPos);
        return this.processSelection(checking, editor, selectionText, startPos, endPos, decryptInPlace);
    }
    getClosestPrevTextCursorPos(editor, text, defaultValue) {
        const initOffset = editor.posToOffset(editor.getCursor("from"));
        for (let offset = initOffset; offset >= 0; offset--) {
            const offsetPos = editor.offsetToPos(offset);
            const textEndOffset = offset + text.length;
            const prefixEndPos = editor.offsetToPos(textEndOffset);
            const testText = editor.getRange(offsetPos, prefixEndPos);
            if (testText == text) {
                return offsetPos;
            }
        }
        return defaultValue;
    }
    getClosestNextTextCursorPos(editor, text, defaultValue) {
        const initOffset = editor.posToOffset(editor.getCursor("from"));
        const lastLineNum = editor.lastLine();
        let maxOffset = editor.posToOffset({ line: lastLineNum, ch: editor.getLine(lastLineNum).length });
        for (let offset = initOffset; offset <= maxOffset - text.length; offset++) {
            const offsetPos = editor.offsetToPos(offset);
            const textEndOffset = offset + text.length;
            const prefixEndPos = editor.offsetToPos(textEndOffset);
            const testText = editor.getRange(offsetPos, prefixEndPos);
            if (testText == text) {
                return prefixEndPos;
            }
        }
        return defaultValue;
    }
    analyseSelection(selectionText) {
        const result = new SelectionAnalysis();
        result.isEmpty = selectionText.length === 0;
        result.hasObsoleteEncryptedPrefix = selectionText.startsWith(_PREFIX_OBSOLETE);
        result.hasEncryptedPrefix = result.hasObsoleteEncryptedPrefix || selectionText.startsWith(_PREFIX_A);
        result.hasDecryptSuffix = selectionText.endsWith(_SUFFIX);
        result.containsEncryptedMarkers =
            selectionText.contains(_PREFIX_OBSOLETE)
                || selectionText.contains(_PREFIX_A)
                || selectionText.contains(_SUFFIX);
        result.canDecrypt = result.hasEncryptedPrefix && result.hasDecryptSuffix;
        result.canEncrypt = !result.hasEncryptedPrefix && !result.containsEncryptedMarkers;
        if (result.canDecrypt) {
            result.decryptable = this.parseDecryptableContent(selectionText);
            if (result.decryptable == null) {
                result.canDecrypt = false;
            }
        }
        return result;
    }
    processSelection(checking, editor, selectionText, finalSelectionStart, finalSelectionEnd, decryptInPlace) {
        var _a;
        const selectionAnalysis = this.analyseSelection(selectionText);
        if (selectionAnalysis.isEmpty) {
            if (!checking) {
                new obsidian.Notice('Nothing to Encrypt.');
            }
            return false;
        }
        if (!selectionAnalysis.canDecrypt && !selectionAnalysis.canEncrypt) {
            if (!checking) {
                new obsidian.Notice('Unable to Encrypt or Decrypt that.');
            }
            return false;
        }
        // return false if trying to encrypt using this deprecated method
        // ...so only decryption is allowed going forward
        if (selectionAnalysis.canEncrypt) {
            return false;
        }
        if (checking) {
            return true;
        }
        // Fetch password from user
        // determine default password
        const isRememberPasswordExpired = !this.settings.rememberPassword
            || (this.passwordLastUsedExpiry != null
                && Date.now() > this.passwordLastUsedExpiry);
        const confirmPassword = selectionAnalysis.canEncrypt && this.settings.confirmPassword;
        if (isRememberPasswordExpired || confirmPassword) {
            // forget password
            this.passwordLastUsed = '';
        }
        const pwModal = new PasswordModal(this.app, selectionAnalysis.canEncrypt, confirmPassword, this.passwordLastUsed, (_a = selectionAnalysis.decryptable) === null || _a === void 0 ? void 0 : _a.hint);
        pwModal.onClose = () => {
            var _a;
            const pw = (_a = pwModal.password) !== null && _a !== void 0 ? _a : '';
            if (pw.length == 0) {
                return;
            }
            const hint = pwModal.hint;
            // remember password?
            if (this.settings.rememberPassword) {
                this.passwordLastUsed = pw;
                this.passwordLastUsedExpiry =
                    this.settings.rememberPasswordTimeout == 0
                        ? null
                        : Date.now() + this.settings.rememberPasswordTimeout * 1000 * 60 // new expiry
                ;
            }
            if (selectionAnalysis.canEncrypt) {
                const encryptable = new Encryptable();
                encryptable.text = selectionText;
                encryptable.hint = hint;
                this.encryptSelection(editor, encryptable, pw, finalSelectionStart, finalSelectionEnd);
            }
            else {
                if (selectionAnalysis.decryptable.version == 1) {
                    this.decryptSelection_a(editor, selectionAnalysis.decryptable, pw, finalSelectionStart, finalSelectionEnd, decryptInPlace);
                }
                else {
                    this.decryptSelectionObsolete(editor, selectionAnalysis.decryptable, pw, finalSelectionStart, finalSelectionEnd, decryptInPlace);
                }
            }
        };
        pwModal.open();
        return true;
    }
    encryptSelection(editor, encryptable, password, finalSelectionStart, finalSelectionEnd) {
        return __awaiter(this, void 0, void 0, function* () {
            //encrypt
            const crypto = new CryptoHelperV2();
            const encodedText = this.encodeEncryption(yield crypto.encryptToBase64(encryptable.text, password), encryptable.hint);
            editor.setSelection(finalSelectionStart, finalSelectionEnd);
            editor.replaceSelection(encodedText);
        });
    }
    decryptSelection_a(editor, decryptable, password, selectionStart, selectionEnd, decryptInPlace) {
        return __awaiter(this, void 0, void 0, function* () {
            // decrypt
            const crypto = new CryptoHelperV2();
            const decryptedText = yield crypto.decryptFromBase64(decryptable.base64CipherText, password);
            if (decryptedText === null) {
                new obsidian.Notice('❌ Decryption failed!');
            }
            else {
                if (decryptInPlace) {
                    editor.setSelection(selectionStart, selectionEnd);
                    editor.replaceSelection(decryptedText);
                }
                else {
                    const decryptModal = new DecryptModal(this.app, '🔓', decryptedText, this.settings.showCopyButton);
                    decryptModal.onClose = () => {
                        editor.focus();
                        if (decryptModal.decryptInPlace) {
                            editor.setSelection(selectionStart, selectionEnd);
                            editor.replaceSelection(decryptedText);
                        }
                    };
                    decryptModal.open();
                }
            }
        });
    }
    decryptSelectionObsolete(editor, decryptable, password, selectionStart, selectionEnd, decryptInPlace) {
        return __awaiter(this, void 0, void 0, function* () {
            // decrypt
            const base64CipherText = this.removeMarkers(decryptable.base64CipherText);
            const crypto = new CryptoHelperObsolete();
            const decryptedText = yield crypto.decryptFromBase64(base64CipherText, password);
            if (decryptedText === null) {
                new obsidian.Notice('❌ Decryption failed!');
            }
            else {
                if (decryptInPlace) {
                    editor.setSelection(selectionStart, selectionEnd);
                    editor.replaceSelection(decryptedText);
                }
                else {
                    const decryptModal = new DecryptModal(this.app, '🔓', decryptedText, this.settings.showCopyButton);
                    decryptModal.onClose = () => {
                        editor.focus();
                        if (decryptModal.decryptInPlace) {
                            editor.setSelection(selectionStart, selectionEnd);
                            editor.replaceSelection(decryptedText);
                        }
                    };
                    decryptModal.open();
                }
            }
        });
    }
    parseDecryptableContent(text) {
        const result = new Decryptable();
        let content = text;
        if (content.startsWith(_PREFIX_A) && content.endsWith(_SUFFIX)) {
            result.version = 1;
            content = content.replace(_PREFIX_A, '').replace(_SUFFIX, '');
        }
        else if (content.startsWith(_PREFIX_OBSOLETE) && content.endsWith(_SUFFIX)) {
            result.version = 0;
            content = content.replace(_PREFIX_OBSOLETE, '').replace(_SUFFIX, '');
        }
        else {
            return null; // invalid format
        }
        // check if there is a hint
        //console.table(content);
        if (content.substr(0, _HINT.length) == _HINT) {
            const endHintMarker = content.indexOf(_HINT, _HINT.length);
            if (endHintMarker < 0) {
                return null; // invalid format
            }
            result.hint = content.substring(_HINT.length, endHintMarker);
            result.base64CipherText = content.substring(endHintMarker + _HINT.length);
        }
        else {
            result.base64CipherText = content;
        }
        //console.table(result);
        return result;
    }
    removeMarkers(text) {
        if (text.startsWith(_PREFIX_A) && text.endsWith(_SUFFIX)) {
            return text.replace(_PREFIX_A, '').replace(_SUFFIX, '');
        }
        if (text.startsWith(_PREFIX_OBSOLETE) && text.endsWith(_SUFFIX)) {
            return text.replace(_PREFIX_OBSOLETE, '').replace(_SUFFIX, '');
        }
        return text;
    }
    encodeEncryption(encryptedText, hint) {
        if (!encryptedText.contains(_PREFIX_OBSOLETE) && !encryptedText.contains(_PREFIX_A) && !encryptedText.contains(_SUFFIX)) {
            if (hint) {
                return _PREFIX_A.concat(_HINT, hint, _HINT, encryptedText, _SUFFIX);
            }
            return _PREFIX_A.concat(encryptedText, _SUFFIX);
        }
        return encryptedText;
    }
}
// DEPRECATED below
class SelectionAnalysis {
}
class Encryptable {
}
class Decryptable {
}
// DEPRECATED above

module.exports = MeldEncrypt;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uL3NyYy9EZWNyeXB0TW9kYWwudHMiLCIuLi9zcmMvUGFzc3dvcmRNb2RhbC50cyIsIi4uL3NyYy9DcnlwdG9IZWxwZXIudHMiLCIuLi9zcmMvTWVsZEVuY3J5cHRTZXR0aW5nc1RhYi50cyIsIi4uL3NyYy9FbmNyeXB0ZWRGaWxlQ29udGVudFZpZXcudHMiLCIuLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xyXG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XHJcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XHJcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgc3RhdGUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIGtpbmQgPT09IFwibVwiID8gZiA6IGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyKSA6IGYgPyBmLnZhbHVlIDogc3RhdGUuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHN0YXRlLCB2YWx1ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgd3JpdGUgcHJpdmF0ZSBtZW1iZXIgdG8gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xyXG59XHJcbiIsImltcG9ydCB7IEFwcCwgTW9kYWwgfSBmcm9tICdvYnNpZGlhbic7XHJcblxyXG4vLyBERVBSRUNBVEVEXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlY3J5cHRNb2RhbCBleHRlbmRzIE1vZGFsIHtcclxuXHR0ZXh0OiBzdHJpbmc7XHJcblx0ZGVjcnlwdEluUGxhY2U6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRzaG93Q29weUJ1dHRvbjogYm9vbGVhblxyXG5cclxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcCwgdGl0bGU6IHN0cmluZywgdGV4dDogc3RyaW5nID0gJycsIHNob3dDb3B5QnV0dG9uOmJvb2xlYW4pIHtcclxuXHRcdHN1cGVyKGFwcCk7XHJcblx0XHR0aGlzLnRleHQgPSB0ZXh0O1xyXG5cdFx0dGhpcy50aXRsZUVsLmlubmVyVGV4dCA9IHRpdGxlO1xyXG5cdFx0dGhpcy5zaG93Q29weUJ1dHRvbiA9IHNob3dDb3B5QnV0dG9uO1xyXG5cdH1cclxuXHJcblx0b25PcGVuKCkge1xyXG5cdFx0bGV0IHsgY29udGVudEVsIH0gPSB0aGlzO1xyXG5cclxuXHRcdGNvbnN0IHRleHRFbCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoKS5jcmVhdGVFbCgndGV4dGFyZWEnLCB7IHRleHQ6IHRoaXMudGV4dCB9KTtcclxuXHRcdHRleHRFbC5zdHlsZS53aWR0aCA9ICcxMDAlJztcclxuXHRcdHRleHRFbC5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XHJcblx0XHR0ZXh0RWwucm93cyA9IDEwO1xyXG5cdFx0dGV4dEVsLnJlYWRPbmx5ID0gdHJ1ZTtcclxuXHRcdC8vdGV4dEVsLmZvY3VzKCk7IC8vIERvZXNuJ3Qgc2VlbSB0byB3b3JrIGhlcmUuLi5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4geyB0ZXh0RWwuZm9jdXMoKSB9LDEwMCk7IC8vLi4uIGJ1dCB0aGlzIGRvZXNcclxuXHJcblxyXG5cdFx0Y29uc3QgYnRuQ29udGFpbmVyRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KCcnKTtcclxuXHJcblx0XHRpZiAodGhpcy5zaG93Q29weUJ1dHRvbil7XHJcblx0XHRcdGNvbnN0IGNvcHlCdG5FbCA9IGJ0bkNvbnRhaW5lckVsLmNyZWF0ZUVsKCdidXR0b24nLCB7IHRleHQ6ICdDb3B5JyB9KTtcclxuXHRcdFx0Y29weUJ0bkVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG5cdFx0XHRcdG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRleHRFbC52YWx1ZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGRlY3J5cHRJblBsYWNlQnRuRWwgPSBidG5Db250YWluZXJFbC5jcmVhdGVFbCgnYnV0dG9uJywgeyB0ZXh0OiAnRGVjcnlwdCBpbi1wbGFjZScgfSk7XHJcblx0XHRkZWNyeXB0SW5QbGFjZUJ0bkVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLmRlY3J5cHRJblBsYWNlID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5jbG9zZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Y29uc3QgY2FuY2VsQnRuRWwgPSBidG5Db250YWluZXJFbC5jcmVhdGVFbCgnYnV0dG9uJywgeyB0ZXh0OiAnQ2xvc2UnIH0pO1xyXG5cdFx0Y2FuY2VsQnRuRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMuY2xvc2UoKTtcclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG59IiwiaW1wb3J0IHsgQXBwLCBNb2RhbCwgUGxhdGZvcm0gfSBmcm9tICdvYnNpZGlhbic7XHJcblxyXG4vLyBERVBSRUNBVEVEXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhc3N3b3JkTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XHJcblx0cGFzc3dvcmQ6IHN0cmluZyA9IG51bGw7XHJcblx0aGludDogc3RyaW5nID0gbnVsbDtcclxuXHRkZWZhdWx0UGFzc3dvcmQ6IHN0cmluZyA9IG51bGw7XHJcblx0Y29uZmlybVBhc3N3b3JkOiBib29sZWFuO1xyXG5cdGlzRW5jcnlwdGluZzogYm9vbGVhbjtcclxuXHJcblx0Y29uc3RydWN0b3IoYXBwOiBBcHAsIGlzRW5jcnlwdGluZzpib29sZWFuLCBjb25maXJtUGFzc3dvcmQ6IGJvb2xlYW4sIGRlZmF1bHRQYXNzd29yZDogc3RyaW5nID0gbnVsbCwgaGludDpzdHJpbmcgKSB7XHJcblx0XHRzdXBlcihhcHApO1xyXG5cdFx0dGhpcy5kZWZhdWx0UGFzc3dvcmQgPSBkZWZhdWx0UGFzc3dvcmQ7XHJcblx0XHR0aGlzLmNvbmZpcm1QYXNzd29yZCA9IGNvbmZpcm1QYXNzd29yZDtcclxuXHRcdHRoaXMuaXNFbmNyeXB0aW5nID0gaXNFbmNyeXB0aW5nO1xyXG5cdFx0dGhpcy5oaW50ID0gaGludDtcclxuXHR9XHJcblxyXG5cdG9uT3BlbigpIHtcclxuXHRcdGxldCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcclxuXHJcblx0XHRjb250ZW50RWwuZW1wdHkoKTtcclxuXHJcblx0XHRjb250ZW50RWwuYWRkQ2xhc3MoICdtZWxkLWUtcGFzc3dvcmQnICk7XHJcblx0XHRpZiAoUGxhdGZvcm0uaXNNb2JpbGUpe1xyXG5cdFx0XHRjb250ZW50RWwuYWRkQ2xhc3MoICdtZWxkLWUtcGxhdGZvcm0tbW9iaWxlJyApO1xyXG5cdFx0fWVsc2UgaWYgKFBsYXRmb3JtLmlzRGVza3RvcCl7XHJcblx0XHRcdGNvbnRlbnRFbC5hZGRDbGFzcyggJ21lbGQtZS1wbGF0Zm9ybS1kZXNrdG9wJyApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qIE1haW4gcGFzc3dvcmQgaW5wdXQgcm93ICovXHJcblx0XHRjb25zdCBpbnB1dFB3Q29udGFpbmVyRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KCB7IGNsczonbWVsZC1lLXJvdycgfSApO1xyXG5cdFx0aW5wdXRQd0NvbnRhaW5lckVsLmNyZWF0ZVNwYW4oeyBjbHM6J21lbGQtZS1pY29uJywgdGV4dDogJ/CflJEnIH0pO1xyXG5cdFx0XHJcblx0XHRjb25zdCBwd0lucHV0RWwgPSBpbnB1dFB3Q29udGFpbmVyRWwuY3JlYXRlRWwoJ2lucHV0JywgeyB0eXBlOiAncGFzc3dvcmQnLCB2YWx1ZTogdGhpcy5kZWZhdWx0UGFzc3dvcmQgPz8gJycgfSk7XHJcblxyXG5cdFx0cHdJbnB1dEVsLnBsYWNlaG9sZGVyID0gJ0VudGVyIHlvdXIgcGFzc3dvcmQnO1xyXG5cdFx0cHdJbnB1dEVsLmZvY3VzKCk7XHJcblxyXG5cdFx0aWYgKFBsYXRmb3JtLmlzTW9iaWxlKXtcclxuXHRcdFx0Ly8gQWRkICdOZXh0JyBidXR0b24gZm9yIG1vYmlsZVxyXG5cdFx0XHRjb25zdCBpbnB1dElucHV0TmV4dEJ0bkVsID0gaW5wdXRQd0NvbnRhaW5lckVsLmNyZWF0ZUVsKCdidXR0b24nLCB7XHJcblx0XHRcdFx0dGV4dDogJ+KGkicsXHJcblx0XHRcdFx0Y2xzOidtZWxkLWUtYnV0dG9uLW5leHQnXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRpbnB1dElucHV0TmV4dEJ0bkVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2KSA9PiB7XHJcblx0XHRcdFx0aW5wdXRQYXNzd29yZEhhbmRsZXIoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyogRW5kIE1haW4gcGFzc3dvcmQgaW5wdXQgcm93ICovXHJcblxyXG5cdFx0LyogQ29uZmlybSBwYXNzd29yZCBpbnB1dCByb3cgKi9cclxuXHRcdGNvbnN0IGNvbmZpcm1Qd1Nob3duID0gdGhpcy5jb25maXJtUGFzc3dvcmQ7XHJcblx0XHRjb25zdCBjb25maXJtUHdDb250YWluZXJFbCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoIHsgY2xzOidtZWxkLWUtcm93JyB9ICk7XHJcblx0XHRjb25maXJtUHdDb250YWluZXJFbC5jcmVhdGVTcGFuKCB7IGNsczonbWVsZC1lLWljb24nLCB0ZXh0OiAn8J+UkScgfSApO1xyXG5cdFx0XHJcblx0XHRjb25zdCBwd0NvbmZpcm1JbnB1dEVsID0gY29uZmlybVB3Q29udGFpbmVyRWwuY3JlYXRlRWwoICdpbnB1dCcsIHtcclxuXHRcdFx0dHlwZTogJ3Bhc3N3b3JkJyxcclxuXHRcdFx0dmFsdWU6IHRoaXMuZGVmYXVsdFBhc3N3b3JkID8/ICcnXHJcblx0XHR9KTtcclxuXHRcdHB3Q29uZmlybUlucHV0RWwucGxhY2Vob2xkZXIgPSAnQ29uZmlybSB5b3VyIHBhc3N3b3JkJztcclxuXHJcblx0XHRjb25zdCBtZXNzYWdlRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOidtZWxkLWUtbWVzc2FnZScgfSk7XHJcblx0XHRtZXNzYWdlRWwuaGlkZSgpO1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdGlmIChQbGF0Zm9ybS5pc01vYmlsZSl7XHJcblx0XHRcdC8vIEFkZCAnTmV4dCcgYnV0dG9uIGZvciBtb2JpbGVcclxuXHRcdFx0Y29uc3QgY29uZmlybUlucHV0TmV4dEJ0bkVsID0gY29uZmlybVB3Q29udGFpbmVyRWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcclxuXHRcdFx0XHR0ZXh0OiAn4oaSJyxcclxuXHRcdFx0XHRjbHM6J21lbGQtZS1idXR0b24tbmV4dCdcclxuXHRcdFx0fSk7XHJcblx0XHRcdGNvbmZpcm1JbnB1dE5leHRCdG5FbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT4ge1xyXG5cdFx0XHRcdGNvbmZpcm1QYXNzd29yZEhhbmRsZXIoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmICghY29uZmlybVB3U2hvd24pIHtcclxuXHRcdFx0Y29uZmlybVB3Q29udGFpbmVyRWwuaGlkZSgpO1xyXG5cdFx0fVxyXG5cdFx0LyogRW5kIENvbmZpcm0gcGFzc3dvcmQgaW5wdXQgcm93ICovXHJcblxyXG5cdFx0LyogSGludCBpbnB1dCByb3cgKi9cclxuXHRcdGNvbnN0IGhpbnRJbnB1dFNob3duID0gdGhpcy5pc0VuY3J5cHRpbmc7XHJcblx0XHRjb25zdCBpbnB1dEhpbnRDb250YWluZXJFbCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoIHsgY2xzOidtZWxkLWUtcm93JyB9ICk7XHJcblx0XHRpbnB1dEhpbnRDb250YWluZXJFbC5jcmVhdGVTcGFuKHsgY2xzOidtZWxkLWUtaWNvbicsIHRleHQ6ICfwn5KhJyB9KTtcclxuXHRcdGNvbnN0IGhpbnRJbnB1dEVsID0gaW5wdXRIaW50Q29udGFpbmVyRWwuY3JlYXRlRWwoJ2lucHV0JywgeyB0eXBlOiAndGV4dCcsIHZhbHVlOiB0aGlzLmhpbnQgfSk7XHJcblx0XHRoaW50SW5wdXRFbC5wbGFjZWhvbGRlciA9ICdFbnRlciBhbiBvcHRpb25hbCBwYXNzd29yZCBoaW50JztcclxuXHRcdGlmIChQbGF0Zm9ybS5pc01vYmlsZSl7XHJcblx0XHRcdC8vIEFkZCAnTmV4dCcgYnV0dG9uIGZvciBtb2JpbGVcclxuXHRcdFx0Y29uc3QgaGludElucHV0TmV4dEJ0bkVsID0gaW5wdXRIaW50Q29udGFpbmVyRWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcclxuXHRcdFx0XHR0ZXh0OiAn4oaSJyxcclxuXHRcdFx0XHRjbHM6J21lbGQtZS1idXR0b24tbmV4dCdcclxuXHRcdFx0fSk7XHJcblx0XHRcdGhpbnRJbnB1dE5leHRCdG5FbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT4ge1xyXG5cdFx0XHRcdGhpbnRQYXNzd29yZEhhbmRsZXIoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRpZiAoIWhpbnRJbnB1dFNob3duKXtcclxuXHRcdFx0aW5wdXRIaW50Q29udGFpbmVyRWwuaGlkZSgpO1xyXG5cdFx0fVxyXG5cdFx0LyogRW5kIEhpbnQgaW5wdXQgcm93ICovXHJcblxyXG5cdFx0LyogSGludCB0ZXh0IHJvdyAqL1xyXG5cdFx0Y29uc3Qgc3BhbkhpbnRDb250YWluZXJFbCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoIHsgY2xzOidtZWxkLWUtcm93JyB9ICk7XHJcblx0XHRzcGFuSGludENvbnRhaW5lckVsLmNyZWF0ZVNwYW4oeyBjbHM6J21lbGQtZS1pY29uJywgdGV4dDogJ/CfkqEnIH0pO1xyXG5cdFx0c3BhbkhpbnRDb250YWluZXJFbC5jcmVhdGVTcGFuKCB7Y2xzOiAnbWVsZC1lLWhpbnQnLCB0ZXh0OmBIaW50OiAnJHt0aGlzLmhpbnR9J2B9KTtcclxuXHJcblx0XHRpZiAoaGludElucHV0U2hvd24gfHwgKHRoaXMuaGludCA/PyAnJykubGVuZ3RoPT0wKXtcclxuXHRcdFx0c3BhbkhpbnRDb250YWluZXJFbC5oaWRlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyogRU5EIEhpbnQgdGV4dCByb3cgKi9cclxuXHJcblx0XHRjb25zdCBjb25maXJtUHdCdXR0b25FbCA9IGNvbnRlbnRFbC5jcmVhdGVFbCggJ2J1dHRvbicsIHtcclxuXHRcdFx0dGV4dDonQ29uZmlybScsXHJcblx0XHRcdGNsczonbWVsZC1lLWJ1dHRvbi1jb25maXJtJ1xyXG5cdFx0fSk7XHJcblx0XHRjb25maXJtUHdCdXR0b25FbC5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCAoZXYpID0+e1xyXG5cdFx0XHRpZiAodmFsaWRhdGUoKSl7XHJcblx0XHRcdFx0dGhpcy5jbG9zZSgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRwd0lucHV0RWwuZm9jdXMoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHJcblx0XHRjb25zdCB2YWxpZGF0ZSA9ICgpIDogYm9vbGVhbiA9PiB7XHJcblx0XHRcdGlmIChjb25maXJtUHdTaG93bil7XHJcblx0XHRcdFx0aWYgKHB3SW5wdXRFbC52YWx1ZSAhPSBwd0NvbmZpcm1JbnB1dEVsLnZhbHVlKXtcclxuXHRcdFx0XHRcdC8vIHBhc3N3b3JkcyBkb24ndCBtYXRjaFxyXG5cdFx0XHRcdFx0bWVzc2FnZUVsLnNldFRleHQoJ1Bhc3N3b3JkcyBkb25cXCd0IG1hdGNoJyk7XHJcblx0XHRcdFx0XHRtZXNzYWdlRWwuc2hvdygpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5wYXNzd29yZCA9IHB3SW5wdXRFbC52YWx1ZTtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuaGludCA9IGhpbnRJbnB1dEVsLnZhbHVlO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgaW5wdXRQYXNzd29yZEhhbmRsZXIgPSAoKSA9PntcclxuXHRcdFx0aWYgKGNvbmZpcm1Qd1Nob3duKXtcclxuXHRcdFx0XHRwd0NvbmZpcm1JbnB1dEVsLmZvY3VzKCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoaGludElucHV0U2hvd24pe1xyXG5cdFx0XHRcdGhpbnRJbnB1dEVsLmZvY3VzKCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIHZhbGlkYXRlKCkgKXtcclxuXHRcdFx0XHR0aGlzLmNsb3NlKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBjb25maXJtUGFzc3dvcmRIYW5kbGVyID0gKCkgPT4ge1xyXG5cdFx0XHRpZiAoIHZhbGlkYXRlKCkgKXtcclxuXHRcdFx0XHRpZiAoaGludElucHV0U2hvd24pe1xyXG5cdFx0XHRcdFx0aGludElucHV0RWwuZm9jdXMoKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRoaXMuY2xvc2UoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBoaW50UGFzc3dvcmRIYW5kbGVyID0gKCkgPT4ge1xyXG5cdFx0XHRpZiAodmFsaWRhdGUoKSl7XHJcblx0XHRcdFx0dGhpcy5jbG9zZSgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRwd0lucHV0RWwuZm9jdXMoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRoaW50SW5wdXRFbC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIChldikgPT4ge1xyXG5cdFx0XHRpZiAoXHJcblx0XHRcdFx0KCBldi5jb2RlID09PSAnRW50ZXInIHx8IGV2LmNvZGUgPT09ICdOdW1wYWRFbnRlcicgKVxyXG5cdFx0XHRcdCYmIHB3SW5wdXRFbC52YWx1ZS5sZW5ndGggPiAwXHJcblx0XHRcdCkge1xyXG5cdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0aGludFBhc3N3b3JkSGFuZGxlcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRwd0NvbmZpcm1JbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgKGV2KSA9PiB7XHJcblx0XHRcdGlmIChcclxuXHRcdFx0XHQoIGV2LmNvZGUgPT09ICdFbnRlcicgfHwgZXYuY29kZSA9PT0gJ051bXBhZEVudGVyJyApXHJcblx0XHRcdFx0JiYgcHdDb25maXJtSW5wdXRFbC52YWx1ZS5sZW5ndGggPiAwXHJcblx0XHRcdCkge1xyXG5cdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0Y29uZmlybVBhc3N3b3JkSGFuZGxlcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0cHdJbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgKGV2KSA9PiB7XHJcblx0XHRcdGlmIChcclxuXHRcdFx0XHQoIGV2LmNvZGUgPT09ICdFbnRlcicgfHwgZXYuY29kZSA9PT0gJ051bXBhZEVudGVyJyApXHJcblx0XHRcdFx0JiYgcHdJbnB1dEVsLnZhbHVlLmxlbmd0aCA+IDBcclxuXHRcdFx0KSB7XHJcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRpbnB1dFBhc3N3b3JkSGFuZGxlcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxufSIsImNvbnN0IHZlY3RvclNpemVcdD0gMTY7XHJcbmNvbnN0IHV0ZjhFbmNvZGVyXHQ9IG5ldyBUZXh0RW5jb2RlcigpO1xyXG5jb25zdCB1dGY4RGVjb2Rlclx0PSBuZXcgVGV4dERlY29kZXIoKTtcclxuY29uc3QgaXRlcmF0aW9uc1x0PSAxMDAwO1xyXG5jb25zdCBzYWx0XHRcdFx0PSB1dGY4RW5jb2Rlci5lbmNvZGUoJ1hIV25EQVQ2ZWhNVlkyekQnKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBDcnlwdG9IZWxwZXJWMiB7XHJcblxyXG5cdHByaXZhdGUgYXN5bmMgZGVyaXZlS2V5KHBhc3N3b3JkOnN0cmluZykgOlByb21pc2U8Q3J5cHRvS2V5PiB7XHJcblx0XHRjb25zdCBidWZmZXIgICAgID0gdXRmOEVuY29kZXIuZW5jb2RlKHBhc3N3b3JkKTtcclxuXHRcdGNvbnN0IGtleSAgICAgICAgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmltcG9ydEtleSgncmF3JywgYnVmZmVyLCB7bmFtZTogJ1BCS0RGMid9LCBmYWxzZSwgWydkZXJpdmVLZXknXSk7XHJcblx0XHRjb25zdCBwcml2YXRlS2V5ID0gY3J5cHRvLnN1YnRsZS5kZXJpdmVLZXkoXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUEJLREYyJyxcclxuXHRcdFx0XHRoYXNoOiB7bmFtZTogJ1NIQS0yNTYnfSxcclxuXHRcdFx0XHRpdGVyYXRpb25zLFxyXG5cdFx0XHRcdHNhbHRcclxuXHRcdFx0fSxcclxuXHRcdFx0a2V5LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0FFUy1HQ00nLFxyXG5cdFx0XHRcdGxlbmd0aDogMjU2XHJcblx0XHRcdH0sXHJcblx0XHRcdGZhbHNlLFxyXG5cdFx0XHRbJ2VuY3J5cHQnLCAnZGVjcnlwdCddXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gcHJpdmF0ZUtleTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBhc3luYyBlbmNyeXB0VG9CeXRlcyh0ZXh0OiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPFVpbnQ4QXJyYXk+IHtcclxuXHJcblx0XHRjb25zdCBrZXkgPSBhd2FpdCB0aGlzLmRlcml2ZUtleShwYXNzd29yZCk7XHJcblx0XHRcclxuXHRcdGNvbnN0IHRleHRCeXRlc1RvRW5jcnlwdCA9IHV0ZjhFbmNvZGVyLmVuY29kZSh0ZXh0KTtcclxuXHRcdGNvbnN0IHZlY3RvciA9IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkodmVjdG9yU2l6ZSkpO1xyXG5cdFx0XHJcblx0XHQvLyBlbmNyeXB0IGludG8gYnl0ZXNcclxuXHRcdGNvbnN0IGVuY3J5cHRlZEJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoXHJcblx0XHRcdGF3YWl0IGNyeXB0by5zdWJ0bGUuZW5jcnlwdChcclxuXHRcdFx0XHR7bmFtZTogJ0FFUy1HQ00nLCBpdjogdmVjdG9yfSxcclxuXHRcdFx0XHRrZXksXHJcblx0XHRcdFx0dGV4dEJ5dGVzVG9FbmNyeXB0XHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdGNvbnN0IGZpbmFsQnl0ZXMgPSBuZXcgVWludDhBcnJheSggdmVjdG9yLmJ5dGVMZW5ndGggKyBlbmNyeXB0ZWRCeXRlcy5ieXRlTGVuZ3RoICk7XHJcblx0XHRmaW5hbEJ5dGVzLnNldCggdmVjdG9yLCAwICk7XHJcblx0XHRmaW5hbEJ5dGVzLnNldCggZW5jcnlwdGVkQnl0ZXMsIHZlY3Rvci5ieXRlTGVuZ3RoICk7XHJcblxyXG5cdFx0cmV0dXJuIGZpbmFsQnl0ZXM7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNvbnZlcnRUb1N0cmluZyggYnl0ZXMgOiBVaW50OEFycmF5ICk6IHN0cmluZyB7XHJcblx0XHRsZXQgcmVzdWx0ID0gJyc7XHJcblx0XHRmb3IgKGxldCBpZHggPSAwOyBpZHggPCBieXRlcy5sZW5ndGg7IGlkeCsrKSB7XHJcblx0XHRcdC8vIGFwcGVuZCB0byByZXN1bHRcclxuXHRcdFx0cmVzdWx0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaWR4XSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxuXHJcblx0cHVibGljIGFzeW5jIGVuY3J5cHRUb0Jhc2U2NCh0ZXh0OiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xyXG5cclxuXHRcdGNvbnN0IGZpbmFsQnl0ZXMgPSBhd2FpdCB0aGlzLmVuY3J5cHRUb0J5dGVzKHRleHQsIHBhc3N3b3JkKTtcclxuXHJcblx0XHQvL2NvbnZlcnQgYXJyYXkgdG8gYmFzZTY0XHJcblx0XHRjb25zdCBiYXNlNjRUZXh0ID0gYnRvYSggdGhpcy5jb252ZXJ0VG9TdHJpbmcoZmluYWxCeXRlcykgKTtcclxuXHJcblx0XHRyZXR1cm4gYmFzZTY0VGV4dDtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgc3RyaW5nVG9BcnJheShzdHI6IHN0cmluZyk6IFVpbnQ4QXJyYXkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0cmVzdWx0LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ldyBVaW50OEFycmF5KHJlc3VsdCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYXN5bmMgZGVjcnlwdEZyb21CeXRlcyhlbmNyeXB0ZWRCeXRlczogVWludDhBcnJheSwgcGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XHJcblx0XHR0cnkge1xyXG5cclxuXHRcdFx0Ly8gZXh0cmFjdCBpdlxyXG5cdFx0XHRjb25zdCB2ZWN0b3IgPSBlbmNyeXB0ZWRCeXRlcy5zbGljZSgwLHZlY3RvclNpemUpO1xyXG5cclxuXHRcdFx0Ly8gZXh0cmFjdCBlbmNyeXB0ZWQgdGV4dFxyXG5cdFx0XHRjb25zdCBlbmNyeXB0ZWRUZXh0Qnl0ZXMgPSBlbmNyeXB0ZWRCeXRlcy5zbGljZSh2ZWN0b3JTaXplKTtcclxuXHJcblx0XHRcdGNvbnN0IGtleSA9IGF3YWl0IHRoaXMuZGVyaXZlS2V5KHBhc3N3b3JkKTtcclxuXHJcblx0XHRcdC8vIGRlY3J5cHQgaW50byBieXRlc1xyXG5cdFx0XHRsZXQgZGVjcnlwdGVkQnl0ZXMgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmRlY3J5cHQoXHJcblx0XHRcdFx0e25hbWU6ICdBRVMtR0NNJywgaXY6IHZlY3Rvcn0sXHJcblx0XHRcdFx0a2V5LFxyXG5cdFx0XHRcdGVuY3J5cHRlZFRleHRCeXRlc1xyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0Ly8gY29udmVydCBieXRlcyB0byB0ZXh0XHJcblx0XHRcdGxldCBkZWNyeXB0ZWRUZXh0ID0gdXRmOERlY29kZXIuZGVjb2RlKGRlY3J5cHRlZEJ5dGVzKTtcclxuXHRcdFx0cmV0dXJuIGRlY3J5cHRlZFRleHQ7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdC8vY29uc29sZS5lcnJvcihlKTtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYXN5bmMgZGVjcnlwdEZyb21CYXNlNjQoYmFzZTY0RW5jb2RlZDogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHRcdHRyeSB7XHJcblxyXG5cdFx0XHRsZXQgYnl0ZXNUb0RlY29kZSA9IHRoaXMuc3RyaW5nVG9BcnJheShhdG9iKGJhc2U2NEVuY29kZWQpKTtcclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiBhd2FpdCB0aGlzLmRlY3J5cHRGcm9tQnl0ZXMoYnl0ZXNUb0RlY29kZSwgcGFzc3dvcmQpO1xyXG5cclxuXHRcdFx0Ly8gLy8gZXh0cmFjdCBpdlxyXG5cdFx0XHQvLyBjb25zdCB2ZWN0b3IgPSBieXRlc1RvRGVjb2RlLnNsaWNlKDAsdmVjdG9yU2l6ZSk7XHJcblxyXG5cdFx0XHQvLyAvLyBleHRyYWN0IGVuY3J5cHRlZCB0ZXh0XHJcblx0XHRcdC8vIGNvbnN0IGVuY3J5cHRlZFRleHRCeXRlcyA9IGJ5dGVzVG9EZWNvZGUuc2xpY2UodmVjdG9yU2l6ZSk7XHJcblxyXG5cdFx0XHQvLyBjb25zdCBrZXkgPSBhd2FpdCB0aGlzLmRlcml2ZUtleShwYXNzd29yZCk7XHJcblxyXG5cdFx0XHQvLyAvLyBkZWNyeXB0IGludG8gYnl0ZXNcclxuXHRcdFx0Ly8gbGV0IGRlY3J5cHRlZEJ5dGVzID0gYXdhaXQgY3J5cHRvLnN1YnRsZS5kZWNyeXB0KFxyXG5cdFx0XHQvLyBcdHtuYW1lOiAnQUVTLUdDTScsIGl2OiB2ZWN0b3J9LFxyXG5cdFx0XHQvLyBcdGtleSxcclxuXHRcdFx0Ly8gXHRlbmNyeXB0ZWRUZXh0Qnl0ZXNcclxuXHRcdFx0Ly8gKTtcclxuXHJcblx0XHRcdC8vIC8vIGNvbnZlcnQgYnl0ZXMgdG8gdGV4dFxyXG5cdFx0XHQvLyBsZXQgZGVjcnlwdGVkVGV4dCA9IHV0ZjhEZWNvZGVyLmRlY29kZShkZWNyeXB0ZWRCeXRlcyk7XHJcblx0XHRcdC8vIHJldHVybiBkZWNyeXB0ZWRUZXh0O1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHQvL2NvbnNvbGUuZXJyb3IoZSk7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn1cclxuXHJcbmNvbnN0IGFsZ29yaXRobU9ic29sZXRlID0ge1xyXG5cdG5hbWU6ICdBRVMtR0NNJyxcclxuXHRpdjogbmV3IFVpbnQ4QXJyYXkoWzE5NiwgMTkwLCAyNDAsIDE5MCwgMTg4LCA3OCwgNDEsIDEzMiwgMTUsIDIyMCwgODQsIDIxMV0pLFxyXG5cdHRhZ0xlbmd0aDogMTI4XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDcnlwdG9IZWxwZXJPYnNvbGV0ZSB7XHJcblxyXG5cdHByaXZhdGUgYXN5bmMgYnVpbGRLZXkocGFzc3dvcmQ6IHN0cmluZykge1xyXG5cdFx0bGV0IHV0ZjhFbmNvZGUgPSBuZXcgVGV4dEVuY29kZXIoKTtcclxuXHRcdGxldCBwYXNzd29yZEJ5dGVzID0gdXRmOEVuY29kZS5lbmNvZGUocGFzc3dvcmQpO1xyXG5cclxuXHRcdGxldCBwYXNzd29yZERpZ2VzdCA9IGF3YWl0IGNyeXB0by5zdWJ0bGUuZGlnZXN0KHsgbmFtZTogJ1NIQS0yNTYnIH0sIHBhc3N3b3JkQnl0ZXMpO1xyXG5cclxuXHRcdGxldCBrZXkgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmltcG9ydEtleShcclxuXHRcdFx0J3JhdycsXHJcblx0XHRcdHBhc3N3b3JkRGlnZXN0LFxyXG5cdFx0XHRhbGdvcml0aG1PYnNvbGV0ZSxcclxuXHRcdFx0ZmFsc2UsXHJcblx0XHRcdFsnZW5jcnlwdCcsICdkZWNyeXB0J11cclxuXHRcdCk7XHJcblxyXG5cdFx0cmV0dXJuIGtleTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBhc3luYyBlbmNyeXB0VG9CYXNlNjQodGV4dDogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHRcdGxldCBrZXkgPSBhd2FpdCB0aGlzLmJ1aWxkS2V5KHBhc3N3b3JkKTtcclxuXHJcblx0XHRsZXQgdXRmOEVuY29kZSA9IG5ldyBUZXh0RW5jb2RlcigpO1xyXG5cdFx0bGV0IGJ5dGVzVG9FbmNyeXB0ID0gdXRmOEVuY29kZS5lbmNvZGUodGV4dCk7XHJcblxyXG5cdFx0Ly8gZW5jcnlwdCBpbnRvIGJ5dGVzXHJcblx0XHRsZXQgZW5jcnlwdGVkQnl0ZXMgPSBuZXcgVWludDhBcnJheShhd2FpdCBjcnlwdG8uc3VidGxlLmVuY3J5cHQoXHJcblx0XHRcdGFsZ29yaXRobU9ic29sZXRlLCBrZXksIGJ5dGVzVG9FbmNyeXB0XHJcblx0XHQpKTtcclxuXHJcblx0XHQvL2NvbnZlcnQgYXJyYXkgdG8gYmFzZTY0XHJcblx0XHRsZXQgYmFzZTY0VGV4dCA9IGJ0b2EoIFN0cmluZy5mcm9tQ2hhckNvZGUoLi4uZW5jcnlwdGVkQnl0ZXMpICk7XHJcblxyXG5cdFx0cmV0dXJuIGJhc2U2NFRleHQ7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIHN0cmluZ1RvQXJyYXkoc3RyOiBzdHJpbmcpOiBVaW50OEFycmF5IHtcclxuXHRcdHZhciByZXN1bHQgPSBbXTtcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHJlc3VsdC5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXcgVWludDhBcnJheShyZXN1bHQpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGFzeW5jIGRlY3J5cHRGcm9tQmFzZTY0KGJhc2U2NEVuY29kZWQ6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHQvLyBjb252ZXJ0IGJhc2UgNjQgdG8gYXJyYXlcclxuXHRcdFx0bGV0IGJ5dGVzVG9EZWNyeXB0ID0gdGhpcy5zdHJpbmdUb0FycmF5KGF0b2IoYmFzZTY0RW5jb2RlZCkpO1xyXG5cclxuXHRcdFx0bGV0IGtleSA9IGF3YWl0IHRoaXMuYnVpbGRLZXkocGFzc3dvcmQpO1xyXG5cclxuXHRcdFx0Ly8gZGVjcnlwdCBpbnRvIGJ5dGVzXHJcblx0XHRcdGxldCBkZWNyeXB0ZWRCeXRlcyA9IGF3YWl0IGNyeXB0by5zdWJ0bGUuZGVjcnlwdChhbGdvcml0aG1PYnNvbGV0ZSwga2V5LCBieXRlc1RvRGVjcnlwdCk7XHJcblxyXG5cdFx0XHQvLyBjb252ZXJ0IGJ5dGVzIHRvIHRleHRcclxuXHRcdFx0bGV0IHV0ZjhEZWNvZGUgPSBuZXcgVGV4dERlY29kZXIoKTtcclxuXHRcdFx0bGV0IGRlY3J5cHRlZFRleHQgPSB1dGY4RGVjb2RlLmRlY29kZShkZWNyeXB0ZWRCeXRlcyk7XHJcblx0XHRcdHJldHVybiBkZWNyeXB0ZWRUZXh0O1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IEFwcCwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xyXG5pbXBvcnQgTWVsZEVuY3J5cHQgZnJvbSBcIi4vbWFpblwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVsZEVuY3J5cHRTZXR0aW5nc1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xyXG5cdHBsdWdpbjogTWVsZEVuY3J5cHQ7XHJcblxyXG5cdHB3VGltZW91dFNldHRpbmc6U2V0dGluZztcclxuXHJcblx0Y29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogTWVsZEVuY3J5cHQpIHtcclxuXHRcdHN1cGVyKGFwcCwgcGx1Z2luKTtcclxuXHRcdHRoaXMucGx1Z2luID0gcGx1Z2luO1xyXG5cdH1cclxuXHJcblx0ZGlzcGxheSgpOiB2b2lkIHtcclxuXHRcdGxldCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xyXG5cclxuXHRcdGNvbnRhaW5lckVsLmVtcHR5KCk7XHJcblx0XHRcclxuXHRcdGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMScsIHt0ZXh0OiAnU2V0dGluZ3MgZm9yIE1lbGQgRW5jcnlwdCd9KTtcclxuXHJcblxyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcblx0XHRcdC5zZXROYW1lKCdBZGQgcmliYm9uIGljb24gdG8gY3JlYXRlIG5vdGUnKVxyXG5cdFx0XHQuc2V0RGVzYygnQWRkcyBhIHJpYmJvbiBpY29uIHRvIHRoZSBsZWZ0IGJhciB0byBjcmVhdGUgYW4gZW5jcnlwdGVkIG5vdGUuJylcclxuXHRcdFx0LmFkZFRvZ2dsZSggdG9nZ2xlID0+e1xyXG5cdFx0XHRcdHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5hZGRSaWJib25JY29uVG9DcmVhdGVOb3RlKVxyXG5cdFx0XHRcdC5vbkNoYW5nZSggYXN5bmMgdmFsdWUgPT57XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5hZGRSaWJib25JY29uVG9DcmVhdGVOb3RlID0gdmFsdWU7XHJcblx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KVxyXG5cdFx0O1xyXG5cdFx0XHJcblx0XHRjb250YWluZXJFbC5jcmVhdGVFbCgnaHInKTtcclxuXHRcdGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMicsIHt0ZXh0OiAnRGVwcmVjYXRlZCBTZXR0aW5ncyd9KTtcclxuXHJcblx0XHQvLyBERVBSRUNBVEVEIGJlbG93XHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ0V4cGFuZCBzZWxlY3Rpb24gdG8gd2hvbGUgbGluZT8nKVxyXG5cdFx0XHQuc2V0RGVzYygnUGFydGlhbCBzZWxlY3Rpb25zIHdpbGwgZ2V0IGV4cGFuZGVkIHRvIHRoZSB3aG9sZSBsaW5lLicpXHJcblx0XHRcdC5hZGRUb2dnbGUoIHRvZ2dsZSA9PntcclxuXHRcdFx0XHR0b2dnbGVcclxuXHRcdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5leHBhbmRUb1dob2xlTGluZXMpXHJcblx0XHRcdFx0XHQub25DaGFuZ2UoIGFzeW5jIHZhbHVlID0+e1xyXG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5leHBhbmRUb1dob2xlTGluZXMgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0YXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0XHRcdC8vdGhpcy51cGRhdGVTZXR0aW5nc1VpKCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHR9KVxyXG5cdFx0O1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnQ29uZmlybSBwYXNzd29yZD8nKVxyXG5cdFx0XHQuc2V0RGVzYygnQ29uZmlybSBwYXNzd29yZCB3aGVuIGVuY3J5cHRpbmcuJylcclxuXHRcdFx0LmFkZFRvZ2dsZSggdG9nZ2xlID0+e1xyXG5cdFx0XHRcdHRvZ2dsZVxyXG5cdFx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbmZpcm1QYXNzd29yZClcclxuXHRcdFx0XHRcdC5vbkNoYW5nZSggYXN5bmMgdmFsdWUgPT57XHJcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbmZpcm1QYXNzd29yZCA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHRcdFx0dGhpcy51cGRhdGVTZXR0aW5nc1VpKCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHR9KVxyXG5cdFx0O1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnQ29weSBidXR0b24/JylcclxuXHRcdFx0LnNldERlc2MoJ1Nob3cgYSBidXR0b24gdG8gY29weSBkZWNyeXB0ZWQgdGV4dC4nKVxyXG5cdFx0XHQuYWRkVG9nZ2xlKCB0b2dnbGUgPT57XHJcblx0XHRcdFx0dG9nZ2xlXHJcblx0XHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd0NvcHlCdXR0b24pXHJcblx0XHRcdFx0XHQub25DaGFuZ2UoIGFzeW5jIHZhbHVlID0+e1xyXG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93Q29weUJ1dHRvbiA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHRcdFx0dGhpcy51cGRhdGVTZXR0aW5nc1VpKCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHR9KVxyXG5cdFx0O1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnUmVtZW1iZXIgcGFzc3dvcmQ/JylcclxuXHRcdFx0LnNldERlc2MoJ1JlbWVtYmVyIHRoZSBsYXN0IHVzZWQgcGFzc3dvcmQgZm9yIHRoaXMgc2Vzc2lvbi4nKVxyXG5cdFx0XHQuYWRkVG9nZ2xlKCB0b2dnbGUgPT57XHJcblx0XHRcdFx0dG9nZ2xlXHJcblx0XHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVtZW1iZXJQYXNzd29yZClcclxuXHRcdFx0XHRcdC5vbkNoYW5nZSggYXN5bmMgdmFsdWUgPT57XHJcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbWVtYmVyUGFzc3dvcmQgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0YXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0XHRcdHRoaXMudXBkYXRlU2V0dGluZ3NVaSgpO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0fSlcclxuXHRcdDtcclxuXHJcblx0XHR0aGlzLnB3VGltZW91dFNldHRpbmcgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoIHRoaXMuYnVpbGRQYXNzd29yZFRpbWVvdXRTZXR0aW5nTmFtZSgpIClcclxuXHRcdFx0LnNldERlc2MoJ1RoZSBudW1iZXIgb2YgbWludXRlcyB0byByZW1lbWJlciB0aGUgbGFzdCB1c2VkIHBhc3N3b3JkLicpXHJcblx0XHRcdC5hZGRTbGlkZXIoIHNsaWRlciA9PiB7XHJcblx0XHRcdFx0c2xpZGVyXHJcblx0XHRcdFx0XHQuc2V0TGltaXRzKDAsIDEyMCwgNSlcclxuXHRcdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW1lbWJlclBhc3N3b3JkVGltZW91dClcclxuXHRcdFx0XHRcdC5vbkNoYW5nZSggYXN5bmMgdmFsdWUgPT4ge1xyXG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW1lbWJlclBhc3N3b3JkVGltZW91dCA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHRcdFx0dGhpcy51cGRhdGVTZXR0aW5nc1VpKCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdDtcclxuXHRcdFx0XHRcclxuXHRcdFx0fSlcclxuXHRcdDtcclxuXHJcblx0XHR0aGlzLnVwZGF0ZVNldHRpbmdzVWkoKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZVNldHRpbmdzVWkoKTp2b2lke1xyXG5cdFx0dGhpcy5wd1RpbWVvdXRTZXR0aW5nLnNldE5hbWUodGhpcy5idWlsZFBhc3N3b3JkVGltZW91dFNldHRpbmdOYW1lKCkpO1xyXG5cclxuXHJcblx0XHRpZiAoIHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbWVtYmVyUGFzc3dvcmQgKXtcclxuXHRcdFx0dGhpcy5wd1RpbWVvdXRTZXR0aW5nLnNldHRpbmdFbC5zaG93KCk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0dGhpcy5wd1RpbWVvdXRTZXR0aW5nLnNldHRpbmdFbC5oaWRlKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRidWlsZFBhc3N3b3JkVGltZW91dFNldHRpbmdOYW1lKCk6c3RyaW5ne1xyXG5cdFx0Y29uc3QgdmFsdWUgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW1lbWJlclBhc3N3b3JkVGltZW91dDtcclxuXHRcdGxldCB0aW1lb3V0U3RyaW5nID0gYCR7dmFsdWV9IG1pbnV0ZXNgO1xyXG5cdFx0aWYodmFsdWUgPT0gMCl7XHJcblx0XHRcdHRpbWVvdXRTdHJpbmcgPSAnTmV2ZXIgZm9yZ2V0JztcclxuXHRcdH1cclxuXHRcdHJldHVybiBgUmVtZW1iZXIgUGFzc3dvcmQgVGltZW91dCAoJHt0aW1lb3V0U3RyaW5nfSlgO1xyXG5cdH1cclxufSIsImltcG9ydCB7IE1lbnUsIE1lbnVJdGVtLCBOb3RpY2UsIFNldHRpbmcsIFRleHRGaWxlVmlldyB9IGZyb20gJ29ic2lkaWFuJztcclxuaW1wb3J0IHsgV29ya3NwYWNlTGVhZiB9IGZyb20gXCJvYnNpZGlhblwiO1xyXG5pbXBvcnQgeyBDcnlwdG9IZWxwZXJWMiB9IGZyb20gJy4vQ3J5cHRvSGVscGVyJztcclxuXHJcbmV4cG9ydCBlbnVtIEVuY3J5cHRlZEZpbGVDb250ZW50Vmlld1N0YXRlRW51bXtcclxuXHRpbml0LFxyXG5cdGRlY3J5cHROb3RlLFxyXG5cdGVkaXROb3RlLFxyXG5cdGNoYW5nZVBhc3N3b3JkLFxyXG5cdG5ld05vdGVcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFZJRVdfVFlQRV9FTkNSWVBURURfRklMRV9DT05URU5UID0gXCJtZWxkLWVuY3J5cHRlZC1maWxlLWNvbnRlbnQtdmlld1wiO1xyXG5leHBvcnQgY2xhc3MgRW5jcnlwdGVkRmlsZUNvbnRlbnRWaWV3IGV4dGVuZHMgVGV4dEZpbGVWaWV3IHtcclxuXHRcclxuXHQvLyBTdGF0ZVxyXG5cdGN1cnJlbnRWaWV3IDogRW5jcnlwdGVkRmlsZUNvbnRlbnRWaWV3U3RhdGVFbnVtID0gRW5jcnlwdGVkRmlsZUNvbnRlbnRWaWV3U3RhdGVFbnVtLmluaXQ7XHJcblx0ZW5jcnlwdGlvblBhc3N3b3JkOnN0cmluZyA9ICcnO1xyXG5cdGhpbnQ6c3RyaW5nID0gJyc7XHJcblx0Y3VycmVudEVkaXRvclRleHQ6c3RyaW5nID0gJyc7XHJcblx0Ly8gZW5kIHN0YXRlXHJcblx0XHJcblx0ZWxBY3Rpb25JY29uTG9ja05vdGUgOiBIVE1MRWxlbWVudDtcclxuXHRlbEFjdGlvbkNoYW5nZVBhc3N3b3JkIDogSFRNTEVsZW1lbnQ7XHJcblxyXG5cdGNvbnN0cnVjdG9yKGxlYWY6IFdvcmtzcGFjZUxlYWYpIHtcclxuXHRcdHN1cGVyKGxlYWYpO1xyXG5cclxuXHRcdGNvbnNvbGUuZGVidWcoJ0VuY3J5cHRlZEZpbGVDb250ZW50Vmlldy5jb25zdHJ1Y3RvcicsIHtsZWFmfSk7XHJcblxyXG5cdFx0dGhpcy5lbEFjdGlvbkljb25Mb2NrTm90ZSA9IHRoaXMuYWRkQWN0aW9uKCAnbG9jaycsICdMb2NrJywgKCkgPT4gdGhpcy5hY3Rpb25Mb2NrRmlsZSgpICk7XHJcblxyXG5cdFx0dGhpcy5lbEFjdGlvbkNoYW5nZVBhc3N3b3JkID0gdGhpcy5hZGRBY3Rpb24oICdrZXknLCAnQ2hhbmdlIFBhc3N3b3JkJywgKCkgPT4gdGhpcy5hY3Rpb25DaGFuZ2VQYXNzd29yZCgpICk7XHJcblx0XHRcclxuXHRcdHRoaXMuY29udGVudEVsLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcblx0XHR0aGlzLmNvbnRlbnRFbC5zdHlsZS5mbGV4RGlyZWN0aW9uID0gJ2NvbHVtbic7XHJcblx0XHR0aGlzLmNvbnRlbnRFbC5zdHlsZS5hbGlnbkl0ZW1zID0gJ2NlbnRlcic7XHJcblxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBhY3Rpb25Mb2NrRmlsZSgpe1xyXG5cdFx0dGhpcy5lbmNyeXB0aW9uUGFzc3dvcmQgPSAnJztcclxuXHRcdHRoaXMucmVmcmVzaFZpZXcoRW5jcnlwdGVkRmlsZUNvbnRlbnRWaWV3U3RhdGVFbnVtLmRlY3J5cHROb3RlKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgYWN0aW9uQ2hhbmdlUGFzc3dvcmQoKXtcclxuXHRcdHRoaXMucmVmcmVzaFZpZXcoRW5jcnlwdGVkRmlsZUNvbnRlbnRWaWV3U3RhdGVFbnVtLmNoYW5nZVBhc3N3b3JkKTtcclxuXHR9XHJcblxyXG5cdG92ZXJyaWRlIG9uUGFuZU1lbnUobWVudTogTWVudSwgc291cmNlOiBzdHJpbmcpOiB2b2lkIHtcclxuXHRcdGNvbnNvbGUuZGVidWcoIHttZW51LCBzb3VyY2UsICd2aWV3JzogdGhpcy5jdXJyZW50Vmlld30pO1xyXG5cdFx0aWYgKCBzb3VyY2UgPT0gJ3RhYi1oZWFkZXInICYmIHRoaXMuY3VycmVudFZpZXcgPT0gRW5jcnlwdGVkRmlsZUNvbnRlbnRWaWV3U3RhdGVFbnVtLmVkaXROb3RlICl7XHJcblx0XHRcdG1lbnUuYWRkSXRlbSggbSA9PntcclxuXHRcdFx0XHRtXHJcblx0XHRcdFx0XHQuc2V0U2VjdGlvbignYWN0aW9uJylcclxuXHRcdFx0XHRcdC5zZXRJY29uKCdsb2NrJylcclxuXHRcdFx0XHRcdC5zZXRUaXRsZSgnTG9jaycpXHJcblx0XHRcdFx0XHQub25DbGljayggKCkgPT4gdGhpcy5hY3Rpb25Mb2NrRmlsZSgpIClcclxuXHRcdFx0XHQ7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRtZW51LmFkZEl0ZW0oIG0gPT57XHJcblx0XHRcdFx0bVxyXG5cdFx0XHRcdFx0LnNldFNlY3Rpb24oJ2FjdGlvbicpXHJcblx0XHRcdFx0XHQuc2V0SWNvbigna2V5JylcclxuXHRcdFx0XHRcdC5zZXRUaXRsZSgnQ2hhbmdlIFBhc3N3b3JkJylcclxuXHRcdFx0XHRcdC5vbkNsaWNrKCAoKSA9PiB0aGlzLmFjdGlvbkNoYW5nZVBhc3N3b3JkKCkgKVxyXG5cdFx0XHRcdDtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRzdXBlci5vblBhbmVNZW51KG1lbnUsc291cmNlKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgY3JlYXRlVGl0bGUoIHRpdGxlOnN0cmluZyApIDogSFRNTEVsZW1lbnR7XHJcblx0XHRyZXR1cm4gdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KHtcclxuXHRcdFx0dGV4dCA6IGDwn5SQICR7dGl0bGV9IPCflJBgLFxyXG5cdFx0XHRhdHRyIDoge1xyXG5cdFx0XHQgXHRzdHlsZTogJ21hcmdpbi1ib3R0b206MmVtOydcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIHZhbGlkYXRlUGFzc3dvcmQgKCBwdzogc3RyaW5nICkgOiBzdHJpbmcge1xyXG5cdFx0aWYgKHB3Lmxlbmd0aCA9PSAwKXtcclxuXHRcdFx0cmV0dXJuICdQYXNzd29yZCBpcyB0b28gc2hvcnQnO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuICcnO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSB2YWxpZGF0ZUNvbmZpcm0gKCBwdzogc3RyaW5nLCBjcHc6IHN0cmluZyApIDogc3RyaW5nIHtcclxuXHRcdGNvbnN0IHBhc3N3b3JkTWF0Y2ggPSBwdyA9PT0gY3B3O1xyXG5cdFx0cmV0dXJuIHBhc3N3b3JkTWF0Y2ggPyAnJyA6J1Bhc3N3b3JkIGRvZXNuXFwndCBtYXRjaCc7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNyZWF0ZU5ld05vdGVWaWV3KCkgOiBIVE1MRWxlbWVudCB7XHJcblx0XHQvL2NvbnNvbGUuZGVidWcoJ2NyZWF0ZURlY3J5cHROb3RlVmlldycsIHsgXCJoaW50XCI6IHRoaXMuaGludH0gKTtcclxuXHRcdGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY3JlYXRlSW5wdXRDb250YWluZXIoKTtcclxuXHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXIpXHJcblx0XHRcdC5zZXREZXNjKCdQbGVhc2UgcHJvdmlkZSBhIHBhc3N3b3JkIGFuZCBoaW50IHRvIHN0YXJ0IGVkaXRpbmcgdGhpcyBub3RlLicpXHJcblx0XHQ7XHJcblxyXG5cdFx0Y29uc3Qgc3VibWl0ID0gYXN5bmMgKHBhc3N3b3JkOiBzdHJpbmcsIGNvbmZpcm06IHN0cmluZywgaGludDpzdHJpbmcpID0+IHtcclxuXHRcdFx0dmFyIHZhbGlkUHcgPSB0aGlzLnZhbGlkYXRlUGFzc3dvcmQocGFzc3dvcmQpO1xyXG5cdFx0XHR2YXIgdmFsaWRDcHcgPSB0aGlzLnZhbGlkYXRlQ29uZmlybShwYXNzd29yZCwgY29uZmlybSk7XHJcblx0XHRcdHNQYXNzd29yZC5zZXREZXNjKCB2YWxpZFB3ICk7XHJcblx0XHRcdHNDb25maXJtLnNldERlc2MoIHZhbGlkQ3B3ICk7XHJcblxyXG5cdFx0XHRpZiAoIHZhbGlkUHcubGVuZ3RoID09PSAwICYmIHZhbGlkQ3B3Lmxlbmd0aCA9PT0gMCApe1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vc2V0IHBhc3N3b3JkIGFuZCBoaW50IGFuZCBvcGVuIG5vdGVcclxuXHRcdFx0XHR0aGlzLmVuY3J5cHRpb25QYXNzd29yZCA9IHBhc3N3b3JkO1xyXG5cdFx0XHRcdHRoaXMuaGludCA9IGhpbnQ7XHJcblx0XHRcdFx0dGhpcy5jdXJyZW50RWRpdG9yVGV4dCA9IHRoaXMuZmlsZS5iYXNlbmFtZTtcclxuXHJcblx0XHRcdFx0YXdhaXQgdGhpcy5lbmNvZGVBbmRTYXZlKCk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHR0aGlzLnJlZnJlc2hWaWV3KEVuY3J5cHRlZEZpbGVDb250ZW50Vmlld1N0YXRlRW51bS5lZGl0Tm90ZSk7XHJcblxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHBhc3N3b3JkID0gJyc7XHJcblx0XHRsZXQgY29uZmlybSA9ICcnO1xyXG5cdFx0bGV0IGhpbnQgPSAnJztcclxuXHJcblx0XHRjb25zdCBzUGFzc3dvcmQgPSBuZXcgU2V0dGluZyhjb250YWluZXIpXHJcblx0XHRcdC5zZXROYW1lKFwiUGFzc3dvcmQ6XCIpXHJcblx0XHRcdC5zZXREZXNjKCcnKVxyXG5cdFx0XHQuYWRkVGV4dCggdGMgPT4ge1xyXG5cdFx0XHRcdHRjLmlucHV0RWwuZm9jdXMoKTtcclxuXHRcdFx0XHR0Yy5pbnB1dEVsLnR5cGUgPSAncGFzc3dvcmQnO1xyXG5cdFx0XHRcdHRjLm9uQ2hhbmdlKCB2ID0+IHtcclxuXHRcdFx0XHRcdHBhc3N3b3JkID0gdjtcclxuXHRcdFx0XHRcdHNQYXNzd29yZC5zZXREZXNjKCB0aGlzLnZhbGlkYXRlUGFzc3dvcmQocGFzc3dvcmQpICk7XHJcblx0XHRcdFx0XHRzQ29uZmlybS5zZXREZXNjKCB0aGlzLnZhbGlkYXRlQ29uZmlybShwYXNzd29yZCwgY29uZmlybSkgKTtcclxuXHRcdFx0XHR9ICk7XHJcblx0XHRcdH0gKVxyXG5cdFx0O1xyXG5cdFx0c1Bhc3N3b3JkLmNvbnRyb2xFbC5vbigna2V5ZG93bicsICcqJywgKGV2KSA9PntcclxuXHRcdFx0aWYgKCBldi5rZXkgPT09ICdFbnRlcicgKSB7XHJcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHQvLyB2YWxpZGF0ZSBwYXNzd29yZFxyXG5cdFx0XHRcdGlmIChwYXNzd29yZC5sZW5ndGggPiAwKXtcclxuXHRcdFx0XHRcdHNDb25maXJtLmNvbnRyb2xFbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLmZvY3VzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRjb25zdCBzQ29uZmlybSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lcilcclxuXHRcdFx0LnNldE5hbWUoXCJDb25maXJtOlwiKVxyXG5cdFx0XHQuc2V0RGVzYygnJylcclxuXHRcdFx0LmFkZFRleHQoIHRjID0+IHtcclxuXHRcdFx0XHR0Yy5pbnB1dEVsLnR5cGUgPSAncGFzc3dvcmQnO1xyXG5cdFx0XHRcdHRjLm9uQ2hhbmdlKCB2ID0+IHtcclxuXHRcdFx0XHRcdGNvbmZpcm0gPSB2O1xyXG5cdFx0XHRcdFx0c1Bhc3N3b3JkLnNldERlc2MoIHRoaXMudmFsaWRhdGVQYXNzd29yZChwYXNzd29yZCkgKTtcclxuXHRcdFx0XHRcdHNDb25maXJtLnNldERlc2MoIHRoaXMudmFsaWRhdGVDb25maXJtKHBhc3N3b3JkLCBjb25maXJtKSApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IClcclxuXHRcdDtcclxuXHRcdHNDb25maXJtLmNvbnRyb2xFbC5vbigna2V5ZG93bicsICcqJywgKGV2KSA9PntcclxuXHRcdFx0aWYgKCBldi5rZXkgPT09ICdFbnRlcicgKSB7XHJcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHQvLyB2YWxpZGF0ZSBjb25maXJtXHJcblx0XHRcdFx0Y29uc3QgcGFzc3dvcmRNYXRjaCA9IHBhc3N3b3JkID09PSBjb25maXJtO1xyXG5cdFx0XHRcdGlmIChwYXNzd29yZE1hdGNoKXtcclxuXHRcdFx0XHRcdHNIaW50LmNvbnRyb2xFbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLmZvY3VzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0Y29uc3Qgc0hpbnQgPSBuZXcgU2V0dGluZyhjb250YWluZXIpXHJcblx0XHRcdC5zZXROYW1lKFwiSGludDpcIilcclxuXHRcdFx0LmFkZFRleHQoKHRjKSA9PntcclxuXHRcdFx0XHR0Yy5vbkNoYW5nZSggdiA9PiB7XHJcblx0XHRcdFx0XHRoaW50ID0gdjtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSlcclxuXHRcdDtcclxuXHRcdHNIaW50LmNvbnRyb2xFbC5vbigna2V5ZG93bicsICcqJywgKGV2KSA9PntcclxuXHRcdFx0aWYgKCBldi5rZXkgPT09ICdFbnRlcicgKSB7XHJcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRzdWJtaXQocGFzc3dvcmQsIGNvbmZpcm0sIGhpbnQpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXIpXHJcblx0XHRcdC5hZGRCdXR0b24oIGJjID0+IHtcclxuXHRcdFx0XHRiY1xyXG5cdFx0XHRcdFx0LnNldEN0YSgpXHJcblx0XHRcdFx0XHQuc2V0SWNvbignZ28tdG8tZmlsZScpXHJcblx0XHRcdFx0XHQuc2V0VG9vbHRpcCgnRWRpdCcpXHJcblx0XHRcdFx0XHQub25DbGljayggKGV2KSA9PiBzdWJtaXQocGFzc3dvcmQsIGNvbmZpcm0sIGhpbnQpIClcclxuXHRcdFx0XHQ7XHJcblx0XHRcdH0pXHJcblx0XHQ7XHJcblxyXG5cdFx0cmV0dXJuIGNvbnRhaW5lcjtcclxuXHR9XHJcblxyXG5cclxuXHRwcml2YXRlIGNyZWF0ZURlY3J5cHROb3RlVmlldygpIDogSFRNTEVsZW1lbnQge1xyXG5cdFx0Y29uc3QgY29udGFpbmVyID0gdGhpcy5jcmVhdGVJbnB1dENvbnRhaW5lcigpO1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lcilcclxuXHRcdFx0LnNldERlc2MoJ1BsZWFzZSBwcm92aWRlIGEgcGFzc3dvcmQgdG8gdW5sb2NrIHRoaXMgbm90ZS4nKVxyXG5cdFx0O1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lcilcclxuXHRcdFx0LnNldE5hbWUoXCJQYXNzd29yZDpcIilcclxuXHRcdFx0LmFkZFRleHQoKHRjKSA9PntcclxuXHRcdFx0XHR0Yy5pbnB1dEVsLnR5cGUgPSAncGFzc3dvcmQnO1xyXG5cdFx0XHRcdHRjLmlucHV0RWwuZm9jdXMoKTtcclxuXHRcdFx0XHR0Yy5zZXRWYWx1ZSh0aGlzLmVuY3J5cHRpb25QYXNzd29yZClcclxuXHRcdFx0XHR0Yy5zZXRQbGFjZWhvbGRlcih0aGlzLmZvcm1hdEhpbnQodGhpcy5oaW50KSk7XHJcblx0XHRcdFx0dGMub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLmVuY3J5cHRpb25QYXNzd29yZCA9IHZhbHVlO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHRjLmlucHV0RWwub25rZXlkb3duID0gYXN5bmMgKGV2KSA9PntcclxuXHRcdFx0XHRcdGlmICggZXYua2V5ID09PSAnRW50ZXInICkge1xyXG5cdFx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLmhhbmRsZURlY3J5cHRCdXR0b25DbGljaygpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdDtcclxuXHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXIpXHJcblx0XHRcdC5hZGRCdXR0b24oIGJjID0+IHtcclxuXHRcdFx0XHRiY1xyXG5cdFx0XHRcdFx0LnNldEN0YSgpXHJcblx0XHRcdFx0XHQuc2V0SWNvbignY2hlY2ttYXJrJylcclxuXHRcdFx0XHRcdC5zZXRUb29sdGlwKCdVbmxvY2sgJiBFZGl0JylcclxuXHRcdFx0XHRcdC5vbkNsaWNrKCAoZXZ0KSA9PiB0aGlzLmhhbmRsZURlY3J5cHRCdXR0b25DbGljaygpIClcclxuXHRcdFx0XHQ7XHJcblx0XHRcdH0pXHJcblx0XHQ7XHJcblxyXG5cdFx0cmV0dXJuIGNvbnRhaW5lcjtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgYXN5bmMgZW5jb2RlQW5kU2F2ZSggKXtcclxuXHRcdHRyeXtcclxuXHJcblx0XHRcdGNvbnNvbGUuZGVidWcoJ2VuY29kZUFuZFNhdmUnKTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciBmaWxlRGF0YSA9IGF3YWl0IEZpbGVEYXRhSGVscGVyLmVuY29kZShcclxuXHRcdFx0XHR0aGlzLmVuY3J5cHRpb25QYXNzd29yZCxcclxuXHRcdFx0XHR0aGlzLmhpbnQsXHJcblx0XHRcdFx0dGhpcy5jdXJyZW50RWRpdG9yVGV4dFxyXG5cdFx0XHQpO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5kYXRhID0gSnNvbkZpbGVFbmNvZGluZy5lbmNvZGUoZmlsZURhdGEpO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5yZXF1ZXN0U2F2ZSgpO1xyXG5cdFx0fSBjYXRjaChlKXtcclxuXHRcdFx0Y29uc29sZS5lcnJvcihlKTtcclxuXHRcdFx0bmV3IE5vdGljZShlLCAxMDAwMCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNyZWF0ZUVkaXRvclZpZXcoKSA6IEhUTUxFbGVtZW50IHtcclxuXHRcdC8vY29uc3QgY29udGFpbmVyID0gdGhpcy5jb250ZW50RWwuY3JlYXRlRWwoJ3RleHRhcmVhJyk7XHJcblx0XHRjb25zdCBjb250YWluZXIgPSB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoKTtcclxuXHRcdGNvbnRhaW5lci5jb250ZW50RWRpdGFibGUgPSAndHJ1ZSc7XHJcblx0XHRjb250YWluZXIuc3R5bGUuZmxleEdyb3cgPSAnMSc7XHJcblx0XHRjb250YWluZXIuc3R5bGUuYWxpZ25TZWxmID0gJ3N0cmV0Y2gnO1xyXG5cclxuXHRcdC8vY29udGFpbmVyLnZhbHVlID0gdGhpcy5jdXJyZW50RWRpdG9yVGV4dFxyXG5cdFx0Y29udGFpbmVyLmlubmVyVGV4dCA9IHRoaXMuY3VycmVudEVkaXRvclRleHQ7XHJcblx0XHRjb250YWluZXIuZm9jdXMoKTtcclxuXHJcblx0XHRjb250YWluZXIub24oJ2lucHV0JywgJyonLCBhc3luYyAoZXYsIHRhcmdldCkgPT57XHJcblx0XHRcdGNvbnNvbGUuZGVidWcoJ2VkaXRvciBpbnB1dCcse2V2LCB0YXJnZXR9KTtcclxuXHRcdFx0Ly90aGlzLmN1cnJlbnRFZGl0b3JUZXh0ID0gY29udGFpbmVyLnZhbHVlO1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRFZGl0b3JUZXh0ID0gY29udGFpbmVyLmlubmVyVGV4dDtcclxuXHRcdFx0YXdhaXQgdGhpcy5lbmNvZGVBbmRTYXZlKCk7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBjb250YWluZXI7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNyZWF0ZUlucHV0Q29udGFpbmVyKCkgOiBIVE1MRWxlbWVudHtcclxuXHRcdHJldHVybiB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoIHtcclxuXHRcdFx0J2F0dHInOiB7XHJcblx0XHRcdFx0J3N0eWxlJzogJ3dpZHRoOjEwMCU7IG1heC13aWR0aDo0MDBweDsnXHJcblx0XHRcdH1cclxuXHRcdH0gKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgY3JlYXRlQ2hhbmdlUGFzc3dvcmRWaWV3KCkgOiBIVE1MRWxlbWVudCB7XHJcblx0XHRjb25zdCBjb250YWluZXIgPSB0aGlzLmNyZWF0ZUlucHV0Q29udGFpbmVyKCk7XHJcblxyXG5cdFx0bGV0IG5ld1Bhc3N3b3JkID0gJyc7XHJcblx0XHRsZXQgY29uZmlybSA9ICcnO1xyXG5cdFx0bGV0IG5ld0hpbnQgPSAnJztcclxuXHJcblx0XHRjb25zdCBzdWJtaXQgPSBhc3luYyAobmV3UGFzc3dvcmQ6IHN0cmluZywgY29uZmlybTogc3RyaW5nLCBuZXdIaW50OnN0cmluZykgPT4ge1xyXG5cdFx0XHR2YXIgdmFsaWRQdyA9IHRoaXMudmFsaWRhdGVQYXNzd29yZChuZXdQYXNzd29yZCk7XHJcblx0XHRcdHZhciB2YWxpZENwdyA9IHRoaXMudmFsaWRhdGVDb25maXJtKG5ld1Bhc3N3b3JkLCBjb25maXJtKTtcclxuXHRcdFx0c05ld1Bhc3N3b3JkLnNldERlc2MoIHZhbGlkUHcgKTtcclxuXHRcdFx0c0NvbmZpcm0uc2V0RGVzYyggdmFsaWRDcHcgKTtcclxuXHJcblx0XHRcdGlmICggdmFsaWRQdy5sZW5ndGggPT09IDAgJiYgdmFsaWRDcHcubGVuZ3RoID09PSAwICl7XHJcblx0XHRcdFx0Ly9zZXQgcGFzc3dvcmQgYW5kIGhpbnQgYW5kIG9wZW4gbm90ZVxyXG5cdFx0XHRcdGNvbnNvbGUuZGVidWcoJ2NyZWF0ZUNoYW5nZVBhc3N3b3JkVmlldyBzdWJtaXQnKTtcclxuXHRcdFx0XHR0aGlzLmVuY3J5cHRpb25QYXNzd29yZCA9IG5ld1Bhc3N3b3JkO1xyXG5cdFx0XHRcdHRoaXMuaGludCA9IG5ld0hpbnQ7XHJcblxyXG5cdFx0XHRcdHRoaXMuZW5jb2RlQW5kU2F2ZSgpO1xyXG5cdFx0XHRcdHRoaXMucmVmcmVzaFZpZXcoIEVuY3J5cHRlZEZpbGVDb250ZW50Vmlld1N0YXRlRW51bS5lZGl0Tm90ZSApO1xyXG5cdFx0XHRcdG5ldyBOb3RpY2UoJ1Bhc3N3b3JkIGFuZCBIaW50IHdlcmUgY2hhbmdlZCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGNvbnN0IHNOZXdQYXNzd29yZCA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lcilcclxuXHRcdFx0LnNldE5hbWUoXCJOZXcgUGFzc3dvcmQ6XCIpXHJcblx0XHRcdC5zZXREZXNjKCcnKVxyXG5cdFx0XHQuYWRkVGV4dCggdGMgPT4ge1xyXG5cdFx0XHRcdHRjLmlucHV0RWwudHlwZSA9ICdwYXNzd29yZCc7XHJcblx0XHRcdFx0dGMuaW5wdXRFbC5mb2N1cygpO1xyXG5cdFx0XHRcdHRjLm9uQ2hhbmdlKCB2ID0+IHtcclxuXHRcdFx0XHRcdG5ld1Bhc3N3b3JkID0gdjtcclxuXHRcdFx0XHRcdHNOZXdQYXNzd29yZC5zZXREZXNjKCB0aGlzLnZhbGlkYXRlUGFzc3dvcmQobmV3UGFzc3dvcmQpICk7XHJcblx0XHRcdFx0XHRzQ29uZmlybS5zZXREZXNjKCB0aGlzLnZhbGlkYXRlQ29uZmlybShuZXdQYXNzd29yZCwgY29uZmlybSkgKTtcclxuXHRcdFx0XHR9ICk7XHJcblx0XHRcdH0gKVxyXG5cdFx0O1xyXG5cdFx0c05ld1Bhc3N3b3JkLmNvbnRyb2xFbC5vbigna2V5ZG93bicsICcqJywgKGV2KSA9PntcclxuXHRcdFx0aWYgKCBldi5rZXkgPT09ICdFbnRlcicgKSB7XHJcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHQvLyB2YWxpZGF0ZSBwYXNzd29yZFxyXG5cdFx0XHRcdGlmIChuZXdQYXNzd29yZC5sZW5ndGggPiAwKXtcclxuXHRcdFx0XHRcdHNDb25maXJtLmNvbnRyb2xFbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLmZvY3VzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRjb25zdCBzQ29uZmlybSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lcilcclxuXHRcdFx0LnNldE5hbWUoXCJDb25maXJtOlwiKVxyXG5cdFx0XHQuc2V0RGVzYygnJylcclxuXHRcdFx0LmFkZFRleHQoIHRjID0+IHtcclxuXHRcdFx0XHR0Yy5pbnB1dEVsLnR5cGUgPSAncGFzc3dvcmQnO1xyXG5cdFx0XHRcdHRjLm9uQ2hhbmdlKCB2ID0+IHtcclxuXHRcdFx0XHRcdGNvbmZpcm0gPSB2O1xyXG5cdFx0XHRcdFx0c05ld1Bhc3N3b3JkLnNldERlc2MoIHRoaXMudmFsaWRhdGVQYXNzd29yZChuZXdQYXNzd29yZCkgKTtcclxuXHRcdFx0XHRcdHNDb25maXJtLnNldERlc2MoIHRoaXMudmFsaWRhdGVDb25maXJtKG5ld1Bhc3N3b3JkLCBjb25maXJtKSApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IClcclxuXHRcdDtcclxuXHRcdHNDb25maXJtLmNvbnRyb2xFbC5vbigna2V5ZG93bicsICcqJywgKGV2KSA9PntcclxuXHRcdFx0aWYgKCBldi5rZXkgPT09ICdFbnRlcicgKSB7XHJcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHQvLyB2YWxpZGF0ZSBjb25maXJtXHJcblx0XHRcdFx0Y29uc3QgcGFzc3dvcmRNYXRjaCA9IG5ld1Bhc3N3b3JkID09PSBjb25maXJtO1xyXG5cdFx0XHRcdGlmIChwYXNzd29yZE1hdGNoKXtcclxuXHRcdFx0XHRcdHNIaW50LmNvbnRyb2xFbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLmZvY3VzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0Y29uc3Qgc0hpbnQgPSBuZXcgU2V0dGluZyhjb250YWluZXIpXHJcblx0XHRcdC5zZXROYW1lKFwiTmV3IEhpbnQ6XCIpXHJcblx0XHRcdC5hZGRUZXh0KCh0YykgPT57XHJcblx0XHRcdFx0dGMub25DaGFuZ2UoIHYgPT4ge1xyXG5cdFx0XHRcdFx0bmV3SGludCA9IHY7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pXHJcblx0XHQ7XHJcblx0XHRzSGludC5jb250cm9sRWwub24oJ2tleWRvd24nLCAnKicsIChldikgPT57XHJcblx0XHRcdGlmICggZXYua2V5ID09PSAnRW50ZXInICkge1xyXG5cdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0c3VibWl0KG5ld1Bhc3N3b3JkLCBjb25maXJtLCBuZXdIaW50KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyKVxyXG5cdFx0XHRcdC5hZGRCdXR0b24oIGJjID0+IHtcclxuXHRcdFx0XHRiY1xyXG5cdFx0XHRcdFx0LnJlbW92ZUN0YSgpXHJcblx0XHRcdFx0XHQuc2V0SWNvbignY3Jvc3MnKVxyXG5cdFx0XHRcdFx0Ly8uc2V0QnV0dG9uVGV4dCgnQ2FuY2VsJylcclxuXHRcdFx0XHRcdC5zZXRUb29sdGlwKCdDYW5jZWwnKVxyXG5cdFx0XHRcdFx0Lm9uQ2xpY2soICgpID0+IHtcclxuXHRcdFx0XHRcdFx0dGhpcy5yZWZyZXNoVmlldyggRW5jcnlwdGVkRmlsZUNvbnRlbnRWaWV3U3RhdGVFbnVtLmVkaXROb3RlICk7XHJcblx0XHRcdFx0XHR9IClcclxuXHRcdFx0XHQ7XHJcblx0XHRcdH0pLmFkZEJ1dHRvbiggYmMgPT4ge1xyXG5cdFx0XHRcdGJjXHJcblx0XHRcdFx0XHQuc2V0Q3RhKClcclxuXHRcdFx0XHRcdC5zZXRJY29uKCdjaGVja21hcmsnKVxyXG5cdFx0XHRcdFx0LnNldFRvb2x0aXAoJ0NoYW5nZSBQYXNzd29yZCcpXHJcblx0XHRcdFx0XHQvLy5zZXRCdXR0b25UZXh0KCdDaGFuZ2UgUGFzc3dvcmQnKVxyXG5cdFx0XHRcdFx0LnNldFdhcm5pbmcoKVxyXG5cdFx0XHRcdFx0Lm9uQ2xpY2soIChldikgPT4ge1xyXG5cdFx0XHRcdFx0XHRzdWJtaXQobmV3UGFzc3dvcmQsIGNvbmZpcm0sIG5ld0hpbnQpO1xyXG5cdFx0XHRcdFx0fSApXHJcblx0XHRcdFx0O1xyXG5cdFx0XHR9KVxyXG5cdFx0O1xyXG5cclxuXHRcdHJldHVybiBjb250YWluZXI7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGZvcm1hdEhpbnQoIGhpbnQ6c3RyaW5nICk6IHN0cmluZ3tcclxuXHRcdGlmIChoaW50Lmxlbmd0aCA+IDApe1xyXG5cdFx0XHRyZXR1cm4gYEhpbnQ6ICR7aGludH1gO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiAnJztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgcmVmcmVzaFZpZXcoXHJcblx0XHRuZXdWaWV3OiBFbmNyeXB0ZWRGaWxlQ29udGVudFZpZXdTdGF0ZUVudW1cclxuXHQpe1xyXG5cdFx0XHJcblx0XHRjb25zb2xlLmRlYnVnKCdyZWZyZXNoVmlldycseydjdXJyZW50Vmlldyc6dGhpcy5jdXJyZW50VmlldywgbmV3Vmlld30pO1xyXG5cclxuXHRcdHRoaXMuZWxBY3Rpb25JY29uTG9ja05vdGUuaGlkZSgpO1xyXG5cdFx0dGhpcy5lbEFjdGlvbkNoYW5nZVBhc3N3b3JkLmhpZGUoKTtcclxuXHJcblx0XHQvLyBjbGVhciB2aWV3XHJcblx0XHR0aGlzLmNvbnRlbnRFbC5lbXB0eSgpO1xyXG5cclxuXHRcdHRoaXMuY3VycmVudFZpZXcgPSBuZXdWaWV3O1xyXG5cclxuXHRcdHN3aXRjaCAodGhpcy5jdXJyZW50Vmlldykge1xyXG5cdFx0XHRjYXNlIEVuY3J5cHRlZEZpbGVDb250ZW50Vmlld1N0YXRlRW51bS5uZXdOb3RlOlxyXG5cdFx0XHRcdHRoaXMuY3JlYXRlVGl0bGUoJ1RoaXMgbm90ZSB3aWxsIGJlIGVuY3J5cHRlZCcpO1xyXG5cdFx0XHRcdHRoaXMuY3JlYXRlTmV3Tm90ZVZpZXcoKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlIEVuY3J5cHRlZEZpbGVDb250ZW50Vmlld1N0YXRlRW51bS5kZWNyeXB0Tm90ZTpcclxuXHRcdFx0XHR0aGlzLmNyZWF0ZVRpdGxlKCdUaGlzIG5vdGUgaXMgZW5jcnlwdGVkJyk7XHJcblx0XHRcdFx0dGhpcy5jcmVhdGVEZWNyeXB0Tm90ZVZpZXcoKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdFxyXG5cdFx0XHRjYXNlIEVuY3J5cHRlZEZpbGVDb250ZW50Vmlld1N0YXRlRW51bS5lZGl0Tm90ZTpcclxuXHRcdFx0XHR0aGlzLmVsQWN0aW9uSWNvbkxvY2tOb3RlLnNob3coKTtcclxuXHRcdFx0XHR0aGlzLmVsQWN0aW9uQ2hhbmdlUGFzc3dvcmQuc2hvdygpO1xyXG5cdFx0XHRcdHRoaXMuY3JlYXRlVGl0bGUoJ1RoaXMgbm90ZSBpcyBlbmNyeXB0ZWQnKTtcclxuXHRcdFx0XHR0aGlzLmNyZWF0ZUVkaXRvclZpZXcoKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlIEVuY3J5cHRlZEZpbGVDb250ZW50Vmlld1N0YXRlRW51bS5jaGFuZ2VQYXNzd29yZDpcclxuXHRcdFx0XHR0aGlzLmNyZWF0ZVRpdGxlKCdDaGFuZ2UgZW5jcnlwdGVkIG5vdGUgcGFzc3dvcmQnKTtcclxuXHRcdFx0XHR0aGlzLmNyZWF0ZUNoYW5nZVBhc3N3b3JkVmlldygpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRhc3luYyBoYW5kbGVEZWNyeXB0QnV0dG9uQ2xpY2soKSB7XHJcblx0XHR2YXIgZmlsZURhdGEgPSBKc29uRmlsZUVuY29kaW5nLmRlY29kZSh0aGlzLmRhdGEpXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0Y29uc29sZS5kZWJ1ZygnRGVjcnlwdCBidXR0b24nLCBmaWxlRGF0YSk7XHJcblxyXG5cdFx0Y29uc3QgZGVjcnlwdGVkVGV4dCA9IGF3YWl0IEZpbGVEYXRhSGVscGVyLmRlY3J5cHQoXHJcblx0XHRcdGZpbGVEYXRhLFxyXG5cdFx0XHR0aGlzLmVuY3J5cHRpb25QYXNzd29yZFxyXG5cdFx0KTtcclxuXHJcblx0XHRpZiAoZGVjcnlwdGVkVGV4dCA9PT0gbnVsbCl7XHJcblx0XHRcdG5ldyBOb3RpY2UoJ0RlY3J5cHRpb24gZmFpbGVkJyk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Ly90aGlzLmN1cnJlbnRWaWV3ID0gRW5jcnlwdGVkRmlsZUNvbnRlbnRWaWV3U3RhdGVFbnVtLmVkaXROb3RlO1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRFZGl0b3JUZXh0ID0gZGVjcnlwdGVkVGV4dDtcclxuXHRcdFx0dGhpcy5yZWZyZXNoVmlldyggRW5jcnlwdGVkRmlsZUNvbnRlbnRWaWV3U3RhdGVFbnVtLmVkaXROb3RlKTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHQvLyBpbXBvcnRhbnRcclxuXHRjYW5BY2NlcHRFeHRlbnNpb24oZXh0ZW5zaW9uOiBzdHJpbmcpOiBib29sZWFuIHtcclxuXHRcdGNvbnNvbGUuZGVidWcoJ0VuY3J5cHRlZEZpbGVDb250ZW50Vmlldy5jYW5BY2NlcHRFeHRlbnNpb24nLCB7ZXh0ZW5zaW9ufSk7XHJcblx0XHRyZXR1cm4gZXh0ZW5zaW9uID09ICdlbmNyeXB0ZWQnO1xyXG5cdH1cclxuXHJcblx0Ly8gaW1wb3J0YW50XHJcblx0Z2V0Vmlld1R5cGUoKSB7XHJcblx0XHRyZXR1cm4gVklFV19UWVBFX0VOQ1JZUFRFRF9GSUxFX0NPTlRFTlQ7XHJcblx0fVxyXG5cclxuXHQvLyB0aGUgZGF0YSB0byBzaG93IG9uIHRoZSB2aWV3XHJcblx0b3ZlcnJpZGUgc2V0Vmlld0RhdGEoZGF0YTogc3RyaW5nLCBjbGVhcjogYm9vbGVhbik6IHZvaWQge1xyXG5cdFx0Y29uc29sZS5kZWJ1ZygnRW5jcnlwdGVkRmlsZUNvbnRlbnRWaWV3LnNldFZpZXdEYXRhJywge1xyXG5cdFx0XHRkYXRhLFxyXG5cdFx0XHRjbGVhcixcclxuXHRcdFx0J3Bhc3MnOnRoaXMuZW5jcnlwdGlvblBhc3N3b3JkLFxyXG5cdFx0XHQvLydtb2RlJzp0aGlzLmdldE1vZGUoKSxcclxuXHRcdFx0Ly8nbW9kZS1kYXRhJzp0aGlzLmN1cnJlbnRNb2RlLmdldCgpLFxyXG5cdFx0XHQvLydwcmV2aWV3LW1vZGUtZGF0YSc6dGhpcy5wcmV2aWV3TW9kZS5nZXQoKVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0aWYgKGNsZWFyKXtcclxuXHJcblx0XHRcdHZhciBuZXdWaWV3IDogRW5jcnlwdGVkRmlsZUNvbnRlbnRWaWV3U3RhdGVFbnVtO1xyXG5cdFx0XHRpZiAoZGF0YSA9PT0gJycpe1xyXG5cdFx0XHRcdC8vIGJsYW5rIG5ldyBmaWxlXHJcblx0XHRcdFx0bmV3VmlldyA9IEVuY3J5cHRlZEZpbGVDb250ZW50Vmlld1N0YXRlRW51bS5uZXdOb3RlO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRuZXdWaWV3ID0gRW5jcnlwdGVkRmlsZUNvbnRlbnRWaWV3U3RhdGVFbnVtLmRlY3J5cHROb3RlO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBuZXcgZmlsZSwgd2UgZG9uJ3Qga25vdyB3aGF0IHRoZSBwYXNzd29yZCBpcyB5ZXRcclxuXHRcdFx0dGhpcy5lbmNyeXB0aW9uUGFzc3dvcmQgPSAnJztcclxuXHJcblx0XHRcdC8vIGpzb24gZGVjb2RlIGZpbGUgZGF0YSB0byBnZXQgdGhlIEhpbnRcclxuXHRcdFx0dmFyIGZpbGVEYXRhID0gSnNvbkZpbGVFbmNvZGluZy5kZWNvZGUodGhpcy5kYXRhKTtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuaGludCA9IGZpbGVEYXRhLmhpbnQ7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnJlZnJlc2hWaWV3KCBuZXdWaWV3ICk7XHJcblxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHRoaXMubGVhZi5kZXRhY2goKTtcclxuXHRcdFx0bmV3IE5vdGljZSgnTXVsdGlwbGUgdmlld3Mgb2YgdGhlIHNhbWUgZW5jcnlwdGVkIG5vdGUgaXNuXFwndCBzdXBwb3J0ZWQnKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdH1cclxuXHJcblx0Ly8gdGhlIGRhdGEgdG8gc2F2ZSB0byBkaXNrXHJcblx0b3ZlcnJpZGUgZ2V0Vmlld0RhdGEoKTogc3RyaW5nIHtcclxuXHRcdGNvbnNvbGUuZGVidWcoJ0VuY3J5cHRlZEZpbGVDb250ZW50Vmlldy5nZXRWaWV3RGF0YScsIHtcclxuXHRcdFx0J3RoaXMnOnRoaXMsXHJcblx0XHRcdCdkYXRhJzp0aGlzLmRhdGEsXHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXMuZGF0YTtcclxuXHR9XHJcblxyXG5cdG92ZXJyaWRlIGNsZWFyKCk6IHZvaWQge1xyXG5cdFx0Y29uc29sZS5kZWJ1ZygnRW5jcnlwdGVkRmlsZUNvbnRlbnRWaWV3LmNsZWFyJyk7XHJcblx0fVxyXG5cclxuXHJcbn1cclxuXHJcbmNsYXNzIEZpbGVEYXRhe1xyXG5cdFxyXG5cdHB1YmxpYyB2ZXJzaW9uIDogc3RyaW5nID0gXCIxLjBcIjtcclxuXHRwdWJsaWMgaGludDogc3RyaW5nO1xyXG5cdHB1YmxpYyBlbmNvZGVkRGF0YTpzdHJpbmc7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCBoaW50OnN0cmluZywgZW5jb2RlZERhdGE6c3RyaW5nICl7XHJcblx0XHR0aGlzLmhpbnQgPSBoaW50O1xyXG5cdFx0dGhpcy5lbmNvZGVkRGF0YSA9IGVuY29kZWREYXRhO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgRmlsZURhdGFIZWxwZXJ7XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgYXN5bmMgZW5jb2RlKCBwYXNzOiBzdHJpbmcsIGhpbnQ6c3RyaW5nLCB0ZXh0OnN0cmluZyApIDogUHJvbWlzZTxGaWxlRGF0YT57XHJcblx0XHRjb25zdCBjcnlwdG8gPSBuZXcgQ3J5cHRvSGVscGVyVjIoKTtcclxuXHRcdGNvbnN0IGVuY3J5cHRlZERhdGEgPSBhd2FpdCBjcnlwdG8uZW5jcnlwdFRvQmFzZTY0KHRleHQsIHBhc3MpO1xyXG5cdFx0cmV0dXJuIG5ldyBGaWxlRGF0YShoaW50LCBlbmNyeXB0ZWREYXRhKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgYXN5bmMgZGVjcnlwdCggZGF0YTogRmlsZURhdGEsIHBhc3M6c3RyaW5nICkgOiBQcm9taXNlPHN0cmluZz57XHJcblx0XHRpZiAoIGRhdGEuZW5jb2RlZERhdGEgPT0gJycgKXtcclxuXHRcdFx0cmV0dXJuICcnO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgY3J5cHRvID0gbmV3IENyeXB0b0hlbHBlclYyKCk7XHJcblx0XHRyZXR1cm4gYXdhaXQgY3J5cHRvLmRlY3J5cHRGcm9tQmFzZTY0KGRhdGEuZW5jb2RlZERhdGEsIHBhc3MpO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgSnNvbkZpbGVFbmNvZGluZyB7XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgZW5jb2RlKCBkYXRhOiBGaWxlRGF0YSApIDogc3RyaW5ne1xyXG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEsIG51bGwsIDIpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBkZWNvZGUoIGVuY29kZWRUZXh0OnN0cmluZyApIDogRmlsZURhdGF7XHJcblx0XHRjb25zb2xlLmRlYnVnKCdKc29uRmlsZUVuY29kaW5nLmRlY29kZScse2VuY29kZWRUZXh0fSk7XHJcblx0XHRpZiAoZW5jb2RlZFRleHQgPT09ICcnKXtcclxuXHRcdFx0cmV0dXJuIG5ldyBGaWxlRGF0YSggXCJcIiwgXCJcIiApO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIEpTT04ucGFyc2UoZW5jb2RlZFRleHQpIGFzIEZpbGVEYXRhO1xyXG5cdH1cclxufSIsImltcG9ydCB7IE5vdGljZSwgUGx1Z2luLCBNYXJrZG93blZpZXcsIEVkaXRvciwgRWRpdG9yUG9zaXRpb24sIG1vbWVudCwgbm9ybWFsaXplUGF0aCwgVEZpbGUsIFRGb2xkZXIgfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCBEZWNyeXB0TW9kYWwgZnJvbSAnLi9EZWNyeXB0TW9kYWwnO1xyXG5pbXBvcnQgUGFzc3dvcmRNb2RhbCBmcm9tICcuL1Bhc3N3b3JkTW9kYWwnO1xyXG5pbXBvcnQgeyBDcnlwdG9IZWxwZXJWMiwgQ3J5cHRvSGVscGVyT2Jzb2xldGUgfSBmcm9tICcuL0NyeXB0b0hlbHBlcic7XHJcbmltcG9ydCBNZWxkRW5jcnlwdFNldHRpbmdzVGFiIGZyb20gJy4vTWVsZEVuY3J5cHRTZXR0aW5nc1RhYic7XHJcbmltcG9ydCB7IEVuY3J5cHRlZEZpbGVDb250ZW50VmlldywgVklFV19UWVBFX0VOQ1JZUFRFRF9GSUxFX0NPTlRFTlQgfSBmcm9tICcuL0VuY3J5cHRlZEZpbGVDb250ZW50Vmlldyc7XHJcblxyXG4vLyBERVBSRUNBVEVEIGJlbG93XHJcbmNvbnN0IF9QUkVGSVg6IHN0cmluZyA9ICclJfCflJAnO1xyXG5jb25zdCBfUFJFRklYX09CU09MRVRFOiBzdHJpbmcgPSBfUFJFRklYICsgJyAnO1xyXG5jb25zdCBfUFJFRklYX0E6IHN0cmluZyA9IF9QUkVGSVggKyAnzrEgJztcclxuY29uc3QgX1NVRkZJWDogc3RyaW5nID0gJyDwn5SQJSUnO1xyXG5cclxuY29uc3QgX0hJTlQ6IHN0cmluZyA9ICfwn5KhJztcclxuLy8gREVQUkVDQVRFRCBhYm92ZVxyXG5cclxuaW50ZXJmYWNlIE1lbGRFbmNyeXB0UGx1Z2luU2V0dGluZ3Mge1xyXG5cdGFkZFJpYmJvbkljb25Ub0NyZWF0ZU5vdGU6IGJvb2xlYW4sXHJcblx0Ly8gREVQUkVDQVRFRCBiZWxvd1xyXG5cdGV4cGFuZFRvV2hvbGVMaW5lczogYm9vbGVhbixcclxuXHRjb25maXJtUGFzc3dvcmQ6IGJvb2xlYW47XHJcblx0c2hvd0NvcHlCdXR0b246IGJvb2xlYW47XHJcblx0cmVtZW1iZXJQYXNzd29yZDogYm9vbGVhbjtcclxuXHRyZW1lbWJlclBhc3N3b3JkVGltZW91dDogbnVtYmVyO1xyXG59XHJcblxyXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBNZWxkRW5jcnlwdFBsdWdpblNldHRpbmdzID0ge1xyXG5cdGFkZFJpYmJvbkljb25Ub0NyZWF0ZU5vdGU6IHRydWUsXHJcblx0Ly8gREVQUkVDQVRFRCBiZWxvd1xyXG5cdGV4cGFuZFRvV2hvbGVMaW5lczogdHJ1ZSxcclxuXHRjb25maXJtUGFzc3dvcmQ6IHRydWUsXHJcblx0c2hvd0NvcHlCdXR0b246IHRydWUsXHJcblx0cmVtZW1iZXJQYXNzd29yZDogdHJ1ZSxcclxuXHRyZW1lbWJlclBhc3N3b3JkVGltZW91dDogMzBcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVsZEVuY3J5cHQgZXh0ZW5kcyBQbHVnaW4ge1xyXG5cclxuXHRzZXR0aW5nczogTWVsZEVuY3J5cHRQbHVnaW5TZXR0aW5ncztcclxuXHRwYXNzd29yZExhc3RVc2VkRXhwaXJ5OiBudW1iZXJcclxuXHRwYXNzd29yZExhc3RVc2VkOiBzdHJpbmc7XHJcblxyXG5cdHJpYmJvbkljb25DcmVhdGVOZXdOb3RlPzogSFRNTEVsZW1lbnQ7XHJcblxyXG5cdGFzeW5jIG9ubG9hZCgpIHtcclxuXHJcblx0XHRhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xyXG5cclxuXHRcdHRoaXMudXBkYXRlVWlGb3JTZXR0aW5ncygpO1xyXG5cclxuXHRcdHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgTWVsZEVuY3J5cHRTZXR0aW5nc1RhYih0aGlzLmFwcCwgdGhpcykpO1xyXG5cclxuXHJcblx0XHR0aGlzLnJlZ2lzdGVyVmlldyhcclxuXHRcdFx0VklFV19UWVBFX0VOQ1JZUFRFRF9GSUxFX0NPTlRFTlQsXHJcblx0XHRcdChsZWFmKSA9PiBuZXcgRW5jcnlwdGVkRmlsZUNvbnRlbnRWaWV3KGxlYWYpXHJcblx0XHQpO1xyXG5cclxuXHRcdHRoaXMucmVnaXN0ZXJFeHRlbnNpb25zKFsnZW5jcnlwdGVkJ10sIFZJRVdfVFlQRV9FTkNSWVBURURfRklMRV9DT05URU5UKTtcclxuXHJcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xyXG5cdFx0XHRpZDogJ21lbGQtZW5jcnlwdC1jcmVhdGUtbmV3LW5vdGUnLFxyXG5cdFx0XHRuYW1lOiAnQ3JlYXRlIG5ldyBlbmNyeXB0ZWQgbm90ZScsXHJcblx0XHRcdGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4gdGhpcy5wcm9jZXNzQ3JlYXRlTmV3RW5jcnlwdGVkTm90ZUNvbW1hbmQoY2hlY2tpbmcpXHJcblx0XHR9KTtcclxuXHRcdFxyXG5cclxuXHRcdC8vIERFUFJFQ0FURUQgYmVsb3dcclxuXHJcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xyXG5cdFx0XHRpZDogJ21lbGQtZW5jcnlwdCcsXHJcblx0XHRcdG5hbWU6ICdERVBSRUNBVEVEIC0gRW5jcnlwdC9EZWNyeXB0JyxcclxuXHRcdFx0ZWRpdG9yQ2hlY2tDYWxsYmFjazogKGNoZWNraW5nLCBlZGl0b3IsIHZpZXcpID0+IHRoaXMuZGVwcmVjYXRlZFByb2Nlc3NFbmNyeXB0RGVjcnlwdENvbW1hbmQoY2hlY2tpbmcsIGVkaXRvciwgdmlldywgZmFsc2UpXHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xyXG5cdFx0XHRpZDogJ21lbGQtZW5jcnlwdC1pbi1wbGFjZScsXHJcblx0XHRcdG5hbWU6ICdERVBSRUNBVEVEIC0gRW5jcnlwdC9EZWNyeXB0IEluLXBsYWNlJyxcclxuXHRcdFx0ZWRpdG9yQ2hlY2tDYWxsYmFjazogKGNoZWNraW5nLCBlZGl0b3IsIHZpZXcpID0+IHRoaXMuZGVwcmVjYXRlZFByb2Nlc3NFbmNyeXB0RGVjcnlwdENvbW1hbmQoY2hlY2tpbmcsIGVkaXRvciwgdmlldywgdHJ1ZSlcclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuYWRkQ29tbWFuZCh7XHJcblx0XHRcdGlkOiAnbWVsZC1lbmNyeXB0LW5vdGUnLFxyXG5cdFx0XHRuYW1lOiAnREVQUkVDQVRFRCAtIEVuY3J5cHQvRGVjcnlwdCBXaG9sZSBOb3RlJyxcclxuXHRcdFx0ZWRpdG9yQ2hlY2tDYWxsYmFjazogKGNoZWNraW5nLCBlZGl0b3IsIHZpZXcpID0+IHRoaXMuZGVwcmVjYXRlZFByb2Nlc3NFbmNyeXB0RGVjcnlwdFdob2xlTm90ZUNvbW1hbmQoY2hlY2tpbmcsIGVkaXRvciwgdmlldylcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHQvLyBERVBSRUNBVEVEIGFib3ZlXHJcblx0fVxyXG5cdFxyXG5cdG9udW5sb2FkKCkge1xyXG5cdFx0dGhpcy5hcHAud29ya3NwYWNlLmRldGFjaExlYXZlc09mVHlwZShWSUVXX1RZUEVfRU5DUllQVEVEX0ZJTEVfQ09OVEVOVCk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBsb2FkU2V0dGluZ3MoKSB7XHJcblx0XHR0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcclxuXHRcdGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XHJcblx0XHR0aGlzLnVwZGF0ZVVpRm9yU2V0dGluZ3MoKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgdXBkYXRlVWlGb3JTZXR0aW5ncygpe1xyXG5cdFx0aWYgKHRoaXMuc2V0dGluZ3MuYWRkUmliYm9uSWNvblRvQ3JlYXRlTm90ZSl7XHJcblx0XHRcdC8vIHR1cm4gb24gcmliYm9uIGljb25cclxuXHRcdFx0aWYgKHRoaXMucmliYm9uSWNvbkNyZWF0ZU5ld05vdGUgPT0gbnVsbCl7XHJcblx0XHRcdFx0dGhpcy5yaWJib25JY29uQ3JlYXRlTmV3Tm90ZSA9IHRoaXMuYWRkUmliYm9uSWNvbignbG9jaycsICdDcmVhdGUgbmV3IGVuY3J5cHRlZCBub3RlJywgKGV2KT0+e1xyXG5cdFx0XHRcdFx0dGhpcy5wcm9jZXNzQ3JlYXRlTmV3RW5jcnlwdGVkTm90ZUNvbW1hbmQoZmFsc2UpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Ly8gdHVybiBvZmYgcmliYm9uIGljb25cclxuXHRcdFx0aWYgKHRoaXMucmliYm9uSWNvbkNyZWF0ZU5ld05vdGUgIT0gbnVsbCl7XHJcblx0XHRcdFx0dGhpcy5yaWJib25JY29uQ3JlYXRlTmV3Tm90ZS5yZW1vdmUoKTtcclxuXHRcdFx0XHR0aGlzLnJpYmJvbkljb25DcmVhdGVOZXdOb3RlID0gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aXNTZXR0aW5nc01vZGFsT3BlbigpIDogYm9vbGVhbntcclxuXHRcdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kLXNldHRpbmdzJykgIT09IG51bGw7XHJcblx0fSBcclxuXHJcblx0cHJpdmF0ZSBwcm9jZXNzQ3JlYXRlTmV3RW5jcnlwdGVkTm90ZUNvbW1hbmQoY2hlY2tpbmc6IGJvb2xlYW4pOiBib29sZWFue1xyXG5cdFx0Y29uc29sZS5kZWJ1ZygncHJvY2Vzc0NyZWF0ZU5ld0VuY3J5cHRlZE5vdGVDb21tYW5kJywge2NoZWNraW5nfSk7XHJcblx0XHR0cnl7XHJcblx0XHRcdGlmIChjaGVja2luZyl7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGxldCBuZXdGaWxlbmFtZSA9IG1vbWVudCgpLmZvcm1hdCgnW1VudGl0bGVkXSBZWVlZTU1ERCBoaG1tc3NbLmVuY3J5cHRlZF0nKTsgXHJcblx0XHRcdFxyXG5cdFx0XHRsZXQgbmV3RmlsZUZvbGRlciA6IFRGb2xkZXI7XHJcblx0XHRcdGNvbnN0IGFjdGl2ZUZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xyXG5cclxuXHRcdFx0aWYgKGFjdGl2ZUZpbGUgIT0gbnVsbCl7XHJcblx0XHRcdFx0bmV3RmlsZUZvbGRlciA9IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLmdldE5ld0ZpbGVQYXJlbnQoYWN0aXZlRmlsZS5wYXRoKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0bmV3RmlsZUZvbGRlciA9IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLmdldE5ld0ZpbGVQYXJlbnQoJycpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBuZXdGaWxlcGF0aCA9IG5vcm1hbGl6ZVBhdGgoIG5ld0ZpbGVGb2xkZXIucGF0aCArIFwiL1wiICsgbmV3RmlsZW5hbWUgKTtcclxuXHRcdFx0Y29uc29sZS5kZWJ1ZygncHJvY2Vzc0NyZWF0ZU5ld0VuY3J5cHRlZE5vdGVDb21tYW5kJywge25ld0ZpbGVwYXRofSk7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLmFwcC52YXVsdC5jcmVhdGUobmV3RmlsZXBhdGgsJycpLnRoZW4oIGY9PntcclxuXHRcdFx0XHRjb25zdCBsZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoIGZhbHNlICk7XHJcblx0XHRcdFx0bGVhZi5vcGVuRmlsZSggZiApO1xyXG5cdFx0XHR9KS5jYXRjaCggcmVhc29uID0+e1xyXG5cdFx0XHRcdG5ldyBOb3RpY2UocmVhc29uLCAxMDAwMCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9Y2F0Y2goZSl7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoZSk7XHJcblx0XHRcdG5ldyBOb3RpY2UoZSwgMTAwMDApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gREVQUkVDQVRFRCBiZWxvd1xyXG5cclxuXHRwcml2YXRlIGRlcHJlY2F0ZWRQcm9jZXNzRW5jcnlwdERlY3J5cHRXaG9sZU5vdGVDb21tYW5kKGNoZWNraW5nOiBib29sZWFuLCBlZGl0b3I6IEVkaXRvciwgdmlldzogTWFya2Rvd25WaWV3KTogYm9vbGVhbiB7XHJcblxyXG5cdFx0aWYgKCBjaGVja2luZyAmJiB0aGlzLmlzU2V0dGluZ3NNb2RhbE9wZW4oKSApe1xyXG5cdFx0XHQvLyBTZXR0aW5ncyBpcyBvcGVuLCBlbnN1cmVzIHRoaXMgY29tbWFuZCBjYW4gc2hvdyB1cCBpbiBvdGhlclxyXG5cdFx0XHQvLyBwbHVnaW5zIHdoaWNoIGxpc3QgY29tbWFuZHMgZS5nLiBjdXN0b21pemFibGUtc2lkZWJhclxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBzdGFydFBvcyA9IGVkaXRvci5vZmZzZXRUb1BvcygwKTtcclxuXHRcdGNvbnN0IGVuZFBvcyA9IHsgbGluZTogZWRpdG9yLmxhc3RMaW5lKCksIGNoOiBlZGl0b3IuZ2V0TGluZShlZGl0b3IubGFzdExpbmUoKSkubGVuZ3RoIH07XHJcblxyXG5cdFx0Y29uc3Qgc2VsZWN0aW9uVGV4dCA9IGVkaXRvci5nZXRSYW5nZShzdGFydFBvcywgZW5kUG9zKS50cmltKCk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMucHJvY2Vzc1NlbGVjdGlvbihcclxuXHRcdFx0Y2hlY2tpbmcsXHJcblx0XHRcdGVkaXRvcixcclxuXHRcdFx0c2VsZWN0aW9uVGV4dCxcclxuXHRcdFx0c3RhcnRQb3MsXHJcblx0XHRcdGVuZFBvcyxcclxuXHRcdFx0dHJ1ZVxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZGVwcmVjYXRlZFByb2Nlc3NFbmNyeXB0RGVjcnlwdENvbW1hbmQoY2hlY2tpbmc6IGJvb2xlYW4sIGVkaXRvcjogRWRpdG9yLCB2aWV3OiBNYXJrZG93blZpZXcsIGRlY3J5cHRJblBsYWNlOiBib29sZWFuKTogYm9vbGVhbiB7XHJcblx0XHRpZiAoIGNoZWNraW5nICYmIHRoaXMuaXNTZXR0aW5nc01vZGFsT3BlbigpICl7XHJcblx0XHRcdC8vIFNldHRpbmdzIGlzIG9wZW4sIGVuc3VyZXMgdGhpcyBjb21tYW5kIGNhbiBzaG93IHVwIGluIG90aGVyXHJcblx0XHRcdC8vIHBsdWdpbnMgd2hpY2ggbGlzdCBjb21tYW5kcyBlLmcuIGN1c3RvbWl6YWJsZS1zaWRlYmFyXHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBzdGFydFBvcyA9IGVkaXRvci5nZXRDdXJzb3IoJ2Zyb20nKTtcclxuXHRcdGxldCBlbmRQb3MgPSBlZGl0b3IuZ2V0Q3Vyc29yKCd0bycpO1xyXG5cclxuXHRcdGlmICh0aGlzLnNldHRpbmdzLmV4cGFuZFRvV2hvbGVMaW5lcyl7XHJcblx0XHRcdGNvbnN0IHN0YXJ0TGluZSA9IHN0YXJ0UG9zLmxpbmU7XHJcblx0XHRcdHN0YXJ0UG9zID0geyBsaW5lOiBzdGFydExpbmUsIGNoOiAwIH07IC8vIHdhbnQgdGhlIHN0YXJ0IG9mIHRoZSBmaXJzdCBsaW5lXHJcblxyXG5cdFx0XHRjb25zdCBlbmRMaW5lID0gZW5kUG9zLmxpbmU7XHJcblx0XHRcdGNvbnN0IGVuZExpbmVUZXh0ID0gZWRpdG9yLmdldExpbmUoZW5kTGluZSk7XHJcblx0XHRcdGVuZFBvcyA9IHsgbGluZTogZW5kTGluZSwgY2g6IGVuZExpbmVUZXh0Lmxlbmd0aCB9OyAvLyB3YW50IHRoZSBlbmQgb2YgbGFzdCBsaW5lXHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0aWYgKCAhZWRpdG9yLnNvbWV0aGluZ1NlbGVjdGVkKCkgKXtcclxuXHRcdFx0XHQvLyBub3RoaW5nIHNlbGVjdGVkLCBhc3N1bWUgdXNlciB3YW50cyB0byBkZWNyeXB0LCBleHBhbmQgdG8gc3RhcnQgYW5kIGVuZCBtYXJrZXJzXHJcblx0XHRcdFx0c3RhcnRQb3MgPSB0aGlzLmdldENsb3Nlc3RQcmV2VGV4dEN1cnNvclBvcyhlZGl0b3IsIF9QUkVGSVgsIHN0YXJ0UG9zICk7XHJcblx0XHRcdFx0ZW5kUG9zID0gdGhpcy5nZXRDbG9zZXN0TmV4dFRleHRDdXJzb3JQb3MoZWRpdG9yLCBfU1VGRklYLCBlbmRQb3MgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHNlbGVjdGlvblRleHQgPSBlZGl0b3IuZ2V0UmFuZ2Uoc3RhcnRQb3MsIGVuZFBvcyk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMucHJvY2Vzc1NlbGVjdGlvbihcclxuXHRcdFx0Y2hlY2tpbmcsXHJcblx0XHRcdGVkaXRvcixcclxuXHRcdFx0c2VsZWN0aW9uVGV4dCxcclxuXHRcdFx0c3RhcnRQb3MsXHJcblx0XHRcdGVuZFBvcyxcclxuXHRcdFx0ZGVjcnlwdEluUGxhY2VcclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGdldENsb3Nlc3RQcmV2VGV4dEN1cnNvclBvcyhlZGl0b3I6IEVkaXRvciwgdGV4dDogc3RyaW5nLCBkZWZhdWx0VmFsdWU6RWRpdG9yUG9zaXRpb24gKTogRWRpdG9yUG9zaXRpb257XHJcblx0XHRjb25zdCBpbml0T2Zmc2V0ID0gZWRpdG9yLnBvc1RvT2Zmc2V0KCBlZGl0b3IuZ2V0Q3Vyc29yKFwiZnJvbVwiKSApO1xyXG5cclxuXHRcdGZvciAobGV0IG9mZnNldCA9IGluaXRPZmZzZXQ7IG9mZnNldCA+PSAwOyBvZmZzZXQtLSkge1xyXG5cdFx0XHRjb25zdCBvZmZzZXRQb3MgPSBlZGl0b3Iub2Zmc2V0VG9Qb3Mob2Zmc2V0KTtcclxuXHRcdFx0Y29uc3QgdGV4dEVuZE9mZnNldCA9IG9mZnNldCArIHRleHQubGVuZ3RoO1xyXG5cdFx0XHRjb25zdCBwcmVmaXhFbmRQb3MgPSBlZGl0b3Iub2Zmc2V0VG9Qb3ModGV4dEVuZE9mZnNldCk7XHJcblx0XHRcdFxyXG5cdFx0XHRjb25zdCB0ZXN0VGV4dCA9IGVkaXRvci5nZXRSYW5nZSggb2Zmc2V0UG9zLCBwcmVmaXhFbmRQb3MgKTtcclxuXHRcdFx0aWYgKHRlc3RUZXh0ID09IHRleHQpe1xyXG5cdFx0XHRcdHJldHVybiBvZmZzZXRQb3M7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGVmYXVsdFZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBnZXRDbG9zZXN0TmV4dFRleHRDdXJzb3JQb3MoZWRpdG9yOiBFZGl0b3IsIHRleHQ6IHN0cmluZywgZGVmYXVsdFZhbHVlOkVkaXRvclBvc2l0aW9uICk6IEVkaXRvclBvc2l0aW9ue1xyXG5cdFx0Y29uc3QgaW5pdE9mZnNldCA9IGVkaXRvci5wb3NUb09mZnNldCggZWRpdG9yLmdldEN1cnNvcihcImZyb21cIikgKTtcclxuXHRcdGNvbnN0IGxhc3RMaW5lTnVtID0gZWRpdG9yLmxhc3RMaW5lKCk7XHJcblxyXG5cdFx0bGV0IG1heE9mZnNldCA9IGVkaXRvci5wb3NUb09mZnNldCgge2xpbmU6bGFzdExpbmVOdW0sIGNoOmVkaXRvci5nZXRMaW5lKGxhc3RMaW5lTnVtKS5sZW5ndGh9ICk7XHJcblxyXG5cdFx0Zm9yIChsZXQgb2Zmc2V0ID0gaW5pdE9mZnNldDsgb2Zmc2V0IDw9IG1heE9mZnNldCAtIHRleHQubGVuZ3RoOyBvZmZzZXQrKykge1xyXG5cdFx0XHRjb25zdCBvZmZzZXRQb3MgPSBlZGl0b3Iub2Zmc2V0VG9Qb3Mob2Zmc2V0KTtcclxuXHRcdFx0Y29uc3QgdGV4dEVuZE9mZnNldCA9IG9mZnNldCArIHRleHQubGVuZ3RoO1xyXG5cdFx0XHRjb25zdCBwcmVmaXhFbmRQb3MgPSBlZGl0b3Iub2Zmc2V0VG9Qb3ModGV4dEVuZE9mZnNldCk7XHJcblx0XHRcdFxyXG5cdFx0XHRjb25zdCB0ZXN0VGV4dCA9IGVkaXRvci5nZXRSYW5nZSggb2Zmc2V0UG9zLCBwcmVmaXhFbmRQb3MgKTtcclxuXHRcdFx0XHJcblx0XHRcdGlmICh0ZXN0VGV4dCA9PSB0ZXh0KXtcclxuXHRcdFx0XHRyZXR1cm4gcHJlZml4RW5kUG9zO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBkZWZhdWx0VmFsdWU7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGFuYWx5c2VTZWxlY3Rpb24oIHNlbGVjdGlvblRleHQ6IHN0cmluZyApOlNlbGVjdGlvbkFuYWx5c2lze1xyXG5cdFx0XHJcblx0XHRjb25zdCByZXN1bHQgPSBuZXcgU2VsZWN0aW9uQW5hbHlzaXMoKTtcclxuXHJcblx0XHRyZXN1bHQuaXNFbXB0eSA9IHNlbGVjdGlvblRleHQubGVuZ3RoID09PSAwO1xyXG5cclxuXHRcdHJlc3VsdC5oYXNPYnNvbGV0ZUVuY3J5cHRlZFByZWZpeCA9IHNlbGVjdGlvblRleHQuc3RhcnRzV2l0aChfUFJFRklYX09CU09MRVRFKTtcclxuXHRcdHJlc3VsdC5oYXNFbmNyeXB0ZWRQcmVmaXggPSByZXN1bHQuaGFzT2Jzb2xldGVFbmNyeXB0ZWRQcmVmaXggfHwgc2VsZWN0aW9uVGV4dC5zdGFydHNXaXRoKF9QUkVGSVhfQSk7XHJcblxyXG5cdFx0cmVzdWx0Lmhhc0RlY3J5cHRTdWZmaXggPSBzZWxlY3Rpb25UZXh0LmVuZHNXaXRoKF9TVUZGSVgpO1xyXG5cclxuXHRcdHJlc3VsdC5jb250YWluc0VuY3J5cHRlZE1hcmtlcnMgPVxyXG5cdFx0XHRzZWxlY3Rpb25UZXh0LmNvbnRhaW5zKF9QUkVGSVhfT0JTT0xFVEUpXHJcblx0XHRcdHx8IHNlbGVjdGlvblRleHQuY29udGFpbnMoX1BSRUZJWF9BKVxyXG5cdFx0XHR8fCBzZWxlY3Rpb25UZXh0LmNvbnRhaW5zKF9TVUZGSVgpXHJcblx0XHQ7XHJcblxyXG5cdFx0cmVzdWx0LmNhbkRlY3J5cHQgPSByZXN1bHQuaGFzRW5jcnlwdGVkUHJlZml4ICYmIHJlc3VsdC5oYXNEZWNyeXB0U3VmZml4O1xyXG5cdFx0cmVzdWx0LmNhbkVuY3J5cHQgPSAhcmVzdWx0Lmhhc0VuY3J5cHRlZFByZWZpeCAmJiAhcmVzdWx0LmNvbnRhaW5zRW5jcnlwdGVkTWFya2VycztcclxuXHRcdFxyXG5cdFx0aWYgKHJlc3VsdC5jYW5EZWNyeXB0KXtcclxuXHRcdFx0cmVzdWx0LmRlY3J5cHRhYmxlID0gdGhpcy5wYXJzZURlY3J5cHRhYmxlQ29udGVudChzZWxlY3Rpb25UZXh0KTtcclxuXHRcdFx0aWYgKHJlc3VsdC5kZWNyeXB0YWJsZSA9PSBudWxsKXtcclxuXHRcdFx0XHRyZXN1bHQuY2FuRGVjcnlwdCA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgcHJvY2Vzc1NlbGVjdGlvbihcclxuXHRcdGNoZWNraW5nOiBib29sZWFuLFxyXG5cdFx0ZWRpdG9yOiBFZGl0b3IsXHJcblx0XHRzZWxlY3Rpb25UZXh0OiBzdHJpbmcsXHJcblx0XHRmaW5hbFNlbGVjdGlvblN0YXJ0OiBDb2RlTWlycm9yLlBvc2l0aW9uLFxyXG5cdFx0ZmluYWxTZWxlY3Rpb25FbmQ6IENvZGVNaXJyb3IuUG9zaXRpb24sXHJcblx0XHRkZWNyeXB0SW5QbGFjZTogYm9vbGVhblxyXG5cdCl7XHJcblxyXG5cdFx0Y29uc3Qgc2VsZWN0aW9uQW5hbHlzaXMgPSB0aGlzLmFuYWx5c2VTZWxlY3Rpb24oc2VsZWN0aW9uVGV4dCk7XHJcblxyXG5cdFx0aWYgKHNlbGVjdGlvbkFuYWx5c2lzLmlzRW1wdHkpIHtcclxuXHRcdFx0aWYgKCFjaGVja2luZyl7XHJcblx0XHRcdFx0bmV3IE5vdGljZSgnTm90aGluZyB0byBFbmNyeXB0LicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXNlbGVjdGlvbkFuYWx5c2lzLmNhbkRlY3J5cHQgJiYgIXNlbGVjdGlvbkFuYWx5c2lzLmNhbkVuY3J5cHQpIHtcclxuXHRcdFx0aWYgKCFjaGVja2luZyl7XHJcblx0XHRcdFx0bmV3IE5vdGljZSgnVW5hYmxlIHRvIEVuY3J5cHQgb3IgRGVjcnlwdCB0aGF0LicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyByZXR1cm4gZmFsc2UgaWYgdHJ5aW5nIHRvIGVuY3J5cHQgdXNpbmcgdGhpcyBkZXByZWNhdGVkIG1ldGhvZFxyXG5cdFx0Ly8gLi4uc28gb25seSBkZWNyeXB0aW9uIGlzIGFsbG93ZWQgZ29pbmcgZm9yd2FyZFxyXG5cdFx0aWYgKHNlbGVjdGlvbkFuYWx5c2lzLmNhbkVuY3J5cHQpe1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGNoZWNraW5nKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEZldGNoIHBhc3N3b3JkIGZyb20gdXNlclxyXG5cclxuXHRcdC8vIGRldGVybWluZSBkZWZhdWx0IHBhc3N3b3JkXHJcblx0XHRjb25zdCBpc1JlbWVtYmVyUGFzc3dvcmRFeHBpcmVkID1cclxuXHRcdFx0IXRoaXMuc2V0dGluZ3MucmVtZW1iZXJQYXNzd29yZFxyXG5cdFx0XHR8fCAoXHJcblx0XHRcdFx0dGhpcy5wYXNzd29yZExhc3RVc2VkRXhwaXJ5ICE9IG51bGxcclxuXHRcdFx0XHQmJiBEYXRlLm5vdygpID4gdGhpcy5wYXNzd29yZExhc3RVc2VkRXhwaXJ5XHJcblx0XHRcdClcclxuXHRcdDtcclxuXHJcblx0XHRjb25zdCBjb25maXJtUGFzc3dvcmQgPSBzZWxlY3Rpb25BbmFseXNpcy5jYW5FbmNyeXB0ICYmIHRoaXMuc2V0dGluZ3MuY29uZmlybVBhc3N3b3JkO1xyXG5cclxuXHRcdGlmICggaXNSZW1lbWJlclBhc3N3b3JkRXhwaXJlZCB8fCBjb25maXJtUGFzc3dvcmQgKSB7XHJcblx0XHRcdC8vIGZvcmdldCBwYXNzd29yZFxyXG5cdFx0XHR0aGlzLnBhc3N3b3JkTGFzdFVzZWQgPSAnJztcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBwd01vZGFsID0gbmV3IFBhc3N3b3JkTW9kYWwoXHJcblx0XHRcdHRoaXMuYXBwLFxyXG5cdFx0XHRzZWxlY3Rpb25BbmFseXNpcy5jYW5FbmNyeXB0LFxyXG5cdFx0XHRjb25maXJtUGFzc3dvcmQsXHJcblx0XHRcdHRoaXMucGFzc3dvcmRMYXN0VXNlZCxcclxuXHRcdFx0c2VsZWN0aW9uQW5hbHlzaXMuZGVjcnlwdGFibGU/LmhpbnRcclxuXHRcdCk7XHJcblx0XHRwd01vZGFsLm9uQ2xvc2UgPSAoKSA9PiB7XHJcblx0XHRcdGNvbnN0IHB3ID0gcHdNb2RhbC5wYXNzd29yZCA/PyAnJ1xyXG5cdFx0XHRpZiAocHcubGVuZ3RoID09IDApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Y29uc3QgaGludCA9IHB3TW9kYWwuaGludDtcclxuXHJcblx0XHRcdC8vIHJlbWVtYmVyIHBhc3N3b3JkP1xyXG5cdFx0XHRpZiAodGhpcy5zZXR0aW5ncy5yZW1lbWJlclBhc3N3b3JkKSB7XHJcblx0XHRcdFx0dGhpcy5wYXNzd29yZExhc3RVc2VkID0gcHc7XHJcblx0XHRcdFx0dGhpcy5wYXNzd29yZExhc3RVc2VkRXhwaXJ5ID1cclxuXHRcdFx0XHRcdHRoaXMuc2V0dGluZ3MucmVtZW1iZXJQYXNzd29yZFRpbWVvdXQgPT0gMFxyXG5cdFx0XHRcdFx0XHQ/IG51bGxcclxuXHRcdFx0XHRcdFx0OiBEYXRlLm5vdygpICsgdGhpcy5zZXR0aW5ncy5yZW1lbWJlclBhc3N3b3JkVGltZW91dCAqIDEwMDAgKiA2MC8vIG5ldyBleHBpcnlcclxuXHRcdFx0XHRcdDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHNlbGVjdGlvbkFuYWx5c2lzLmNhbkVuY3J5cHQpIHtcclxuXHRcdFx0XHRjb25zdCBlbmNyeXB0YWJsZSA9IG5ldyBFbmNyeXB0YWJsZSgpO1xyXG5cdFx0XHRcdGVuY3J5cHRhYmxlLnRleHQgPSBzZWxlY3Rpb25UZXh0O1xyXG5cdFx0XHRcdGVuY3J5cHRhYmxlLmhpbnQgPSBoaW50O1xyXG5cclxuXHRcdFx0XHR0aGlzLmVuY3J5cHRTZWxlY3Rpb24oXHJcblx0XHRcdFx0XHRlZGl0b3IsXHJcblx0XHRcdFx0XHRlbmNyeXB0YWJsZSxcclxuXHRcdFx0XHRcdHB3LFxyXG5cdFx0XHRcdFx0ZmluYWxTZWxlY3Rpb25TdGFydCxcclxuXHRcdFx0XHRcdGZpbmFsU2VsZWN0aW9uRW5kXHJcblx0XHRcdFx0KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0aWYgKHNlbGVjdGlvbkFuYWx5c2lzLmRlY3J5cHRhYmxlLnZlcnNpb24gPT0gMSl7XHJcblx0XHRcdFx0XHR0aGlzLmRlY3J5cHRTZWxlY3Rpb25fYShcclxuXHRcdFx0XHRcdFx0ZWRpdG9yLFxyXG5cdFx0XHRcdFx0XHRzZWxlY3Rpb25BbmFseXNpcy5kZWNyeXB0YWJsZSxcclxuXHRcdFx0XHRcdFx0cHcsXHJcblx0XHRcdFx0XHRcdGZpbmFsU2VsZWN0aW9uU3RhcnQsXHJcblx0XHRcdFx0XHRcdGZpbmFsU2VsZWN0aW9uRW5kLFxyXG5cdFx0XHRcdFx0XHRkZWNyeXB0SW5QbGFjZVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRoaXMuZGVjcnlwdFNlbGVjdGlvbk9ic29sZXRlKFxyXG5cdFx0XHRcdFx0XHRlZGl0b3IsXHJcblx0XHRcdFx0XHRcdHNlbGVjdGlvbkFuYWx5c2lzLmRlY3J5cHRhYmxlLFxyXG5cdFx0XHRcdFx0XHRwdyxcclxuXHRcdFx0XHRcdFx0ZmluYWxTZWxlY3Rpb25TdGFydCxcclxuXHRcdFx0XHRcdFx0ZmluYWxTZWxlY3Rpb25FbmQsXHJcblx0XHRcdFx0XHRcdGRlY3J5cHRJblBsYWNlXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cHdNb2RhbC5vcGVuKCk7XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGFzeW5jIGVuY3J5cHRTZWxlY3Rpb24oXHJcblx0XHRlZGl0b3I6IEVkaXRvcixcclxuXHRcdGVuY3J5cHRhYmxlOiBFbmNyeXB0YWJsZSxcclxuXHRcdHBhc3N3b3JkOiBzdHJpbmcsXHJcblx0XHRmaW5hbFNlbGVjdGlvblN0YXJ0OiBDb2RlTWlycm9yLlBvc2l0aW9uLFxyXG5cdFx0ZmluYWxTZWxlY3Rpb25FbmQ6IENvZGVNaXJyb3IuUG9zaXRpb24sXHJcblx0KSB7XHJcblx0XHQvL2VuY3J5cHRcclxuXHRcdGNvbnN0IGNyeXB0byA9IG5ldyBDcnlwdG9IZWxwZXJWMigpO1xyXG5cdFx0Y29uc3QgZW5jb2RlZFRleHQgPSB0aGlzLmVuY29kZUVuY3J5cHRpb24oXHJcblx0XHRcdGF3YWl0IGNyeXB0by5lbmNyeXB0VG9CYXNlNjQoZW5jcnlwdGFibGUudGV4dCwgcGFzc3dvcmQpLFxyXG5cdFx0XHRlbmNyeXB0YWJsZS5oaW50XHJcblx0XHQpO1xyXG5cdFx0ZWRpdG9yLnNldFNlbGVjdGlvbihmaW5hbFNlbGVjdGlvblN0YXJ0LCBmaW5hbFNlbGVjdGlvbkVuZCk7XHJcblx0XHRlZGl0b3IucmVwbGFjZVNlbGVjdGlvbihlbmNvZGVkVGV4dCk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGFzeW5jIGRlY3J5cHRTZWxlY3Rpb25fYShcclxuXHRcdGVkaXRvcjogRWRpdG9yLFxyXG5cdFx0ZGVjcnlwdGFibGU6IERlY3J5cHRhYmxlLFxyXG5cdFx0cGFzc3dvcmQ6IHN0cmluZyxcclxuXHRcdHNlbGVjdGlvblN0YXJ0OiBDb2RlTWlycm9yLlBvc2l0aW9uLFxyXG5cdFx0c2VsZWN0aW9uRW5kOiBDb2RlTWlycm9yLlBvc2l0aW9uLFxyXG5cdFx0ZGVjcnlwdEluUGxhY2U6IGJvb2xlYW5cclxuXHQpIHtcclxuXHRcdC8vIGRlY3J5cHRcclxuXHJcblx0XHRjb25zdCBjcnlwdG8gPSBuZXcgQ3J5cHRvSGVscGVyVjIoKTtcclxuXHRcdGNvbnN0IGRlY3J5cHRlZFRleHQgPSBhd2FpdCBjcnlwdG8uZGVjcnlwdEZyb21CYXNlNjQoZGVjcnlwdGFibGUuYmFzZTY0Q2lwaGVyVGV4dCwgcGFzc3dvcmQpO1xyXG5cdFx0aWYgKGRlY3J5cHRlZFRleHQgPT09IG51bGwpIHtcclxuXHRcdFx0bmV3IE5vdGljZSgn4p2MIERlY3J5cHRpb24gZmFpbGVkIScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdGlmIChkZWNyeXB0SW5QbGFjZSkge1xyXG5cdFx0XHRcdGVkaXRvci5zZXRTZWxlY3Rpb24oc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZCk7XHJcblx0XHRcdFx0ZWRpdG9yLnJlcGxhY2VTZWxlY3Rpb24oZGVjcnlwdGVkVGV4dCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc3QgZGVjcnlwdE1vZGFsID0gbmV3IERlY3J5cHRNb2RhbCh0aGlzLmFwcCwgJ/CflJMnLCBkZWNyeXB0ZWRUZXh0LCB0aGlzLnNldHRpbmdzLnNob3dDb3B5QnV0dG9uKTtcclxuXHRcdFx0XHRkZWNyeXB0TW9kYWwub25DbG9zZSA9ICgpID0+IHtcclxuXHRcdFx0XHRcdGVkaXRvci5mb2N1cygpO1xyXG5cdFx0XHRcdFx0aWYgKGRlY3J5cHRNb2RhbC5kZWNyeXB0SW5QbGFjZSkge1xyXG5cdFx0XHRcdFx0XHRlZGl0b3Iuc2V0U2VsZWN0aW9uKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpO1xyXG5cdFx0XHRcdFx0XHRlZGl0b3IucmVwbGFjZVNlbGVjdGlvbihkZWNyeXB0ZWRUZXh0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGVjcnlwdE1vZGFsLm9wZW4oKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBhc3luYyBkZWNyeXB0U2VsZWN0aW9uT2Jzb2xldGUoXHJcblx0XHRlZGl0b3I6IEVkaXRvcixcclxuXHRcdGRlY3J5cHRhYmxlOiBEZWNyeXB0YWJsZSxcclxuXHRcdHBhc3N3b3JkOiBzdHJpbmcsXHJcblx0XHRzZWxlY3Rpb25TdGFydDogQ29kZU1pcnJvci5Qb3NpdGlvbixcclxuXHRcdHNlbGVjdGlvbkVuZDogQ29kZU1pcnJvci5Qb3NpdGlvbixcclxuXHRcdGRlY3J5cHRJblBsYWNlOiBib29sZWFuXHJcblx0KSB7XHJcblx0XHQvLyBkZWNyeXB0XHJcblx0XHRjb25zdCBiYXNlNjRDaXBoZXJUZXh0ID0gdGhpcy5yZW1vdmVNYXJrZXJzKGRlY3J5cHRhYmxlLmJhc2U2NENpcGhlclRleHQpO1xyXG5cdFx0Y29uc3QgY3J5cHRvID0gbmV3IENyeXB0b0hlbHBlck9ic29sZXRlKCk7XHJcblx0XHRjb25zdCBkZWNyeXB0ZWRUZXh0ID0gYXdhaXQgY3J5cHRvLmRlY3J5cHRGcm9tQmFzZTY0KGJhc2U2NENpcGhlclRleHQsIHBhc3N3b3JkKTtcclxuXHRcdGlmIChkZWNyeXB0ZWRUZXh0ID09PSBudWxsKSB7XHJcblx0XHRcdG5ldyBOb3RpY2UoJ+KdjCBEZWNyeXB0aW9uIGZhaWxlZCEnKTtcclxuXHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRpZiAoZGVjcnlwdEluUGxhY2UpIHtcclxuXHRcdFx0XHRlZGl0b3Iuc2V0U2VsZWN0aW9uKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpO1xyXG5cdFx0XHRcdGVkaXRvci5yZXBsYWNlU2VsZWN0aW9uKGRlY3J5cHRlZFRleHQpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvbnN0IGRlY3J5cHRNb2RhbCA9IG5ldyBEZWNyeXB0TW9kYWwodGhpcy5hcHAsICfwn5STJywgZGVjcnlwdGVkVGV4dCwgdGhpcy5zZXR0aW5ncy5zaG93Q29weUJ1dHRvbik7XHJcblx0XHRcdFx0ZGVjcnlwdE1vZGFsLm9uQ2xvc2UgPSAoKSA9PiB7XHJcblx0XHRcdFx0XHRlZGl0b3IuZm9jdXMoKTtcclxuXHRcdFx0XHRcdGlmIChkZWNyeXB0TW9kYWwuZGVjcnlwdEluUGxhY2UpIHtcclxuXHRcdFx0XHRcdFx0ZWRpdG9yLnNldFNlbGVjdGlvbihzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKTtcclxuXHRcdFx0XHRcdFx0ZWRpdG9yLnJlcGxhY2VTZWxlY3Rpb24oZGVjcnlwdGVkVGV4dCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRlY3J5cHRNb2RhbC5vcGVuKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgcGFyc2VEZWNyeXB0YWJsZUNvbnRlbnQodGV4dDogc3RyaW5nKSA6IERlY3J5cHRhYmxle1xyXG5cdFx0Y29uc3QgcmVzdWx0ID0gbmV3IERlY3J5cHRhYmxlKCk7XHJcblxyXG5cdFx0bGV0IGNvbnRlbnQgPSB0ZXh0O1xyXG5cdFx0aWYgKGNvbnRlbnQuc3RhcnRzV2l0aChfUFJFRklYX0EpICYmIGNvbnRlbnQuZW5kc1dpdGgoX1NVRkZJWCkpIHtcclxuXHRcdFx0cmVzdWx0LnZlcnNpb249MTtcclxuXHRcdFx0Y29udGVudCA9IGNvbnRlbnQucmVwbGFjZShfUFJFRklYX0EsICcnKS5yZXBsYWNlKF9TVUZGSVgsICcnKTtcclxuXHRcdH1lbHNlIGlmIChjb250ZW50LnN0YXJ0c1dpdGgoX1BSRUZJWF9PQlNPTEVURSkgJiYgY29udGVudC5lbmRzV2l0aChfU1VGRklYKSkge1xyXG5cdFx0XHRyZXN1bHQudmVyc2lvbj0wO1xyXG5cdFx0XHRjb250ZW50ID0gY29udGVudC5yZXBsYWNlKF9QUkVGSVhfT0JTT0xFVEUsICcnKS5yZXBsYWNlKF9TVUZGSVgsICcnKTtcclxuXHRcdH1lbHNlIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7IC8vIGludmFsaWQgZm9ybWF0XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2hlY2sgaWYgdGhlcmUgaXMgYSBoaW50XHJcblx0XHQvL2NvbnNvbGUudGFibGUoY29udGVudCk7XHJcblx0XHRpZiAoY29udGVudC5zdWJzdHIoMCxfSElOVC5sZW5ndGgpID09IF9ISU5UKXtcclxuXHRcdFx0Y29uc3QgZW5kSGludE1hcmtlciA9IGNvbnRlbnQuaW5kZXhPZihfSElOVCxfSElOVC5sZW5ndGgpO1xyXG5cdFx0XHRpZiAoZW5kSGludE1hcmtlcjwwKXtcclxuXHRcdFx0XHRyZXR1cm4gbnVsbDsgLy8gaW52YWxpZCBmb3JtYXRcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXN1bHQuaGludCA9IGNvbnRlbnQuc3Vic3RyaW5nKF9ISU5ULmxlbmd0aCxlbmRIaW50TWFya2VyKVxyXG5cdFx0XHRyZXN1bHQuYmFzZTY0Q2lwaGVyVGV4dCA9IGNvbnRlbnQuc3Vic3RyaW5nKGVuZEhpbnRNYXJrZXIrX0hJTlQubGVuZ3RoKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXN1bHQuYmFzZTY0Q2lwaGVyVGV4dCA9IGNvbnRlbnQ7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vY29uc29sZS50YWJsZShyZXN1bHQpO1xyXG5cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSByZW1vdmVNYXJrZXJzKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XHJcblx0XHRpZiAodGV4dC5zdGFydHNXaXRoKF9QUkVGSVhfQSkgJiYgdGV4dC5lbmRzV2l0aChfU1VGRklYKSkge1xyXG5cdFx0XHRyZXR1cm4gdGV4dC5yZXBsYWNlKF9QUkVGSVhfQSwgJycpLnJlcGxhY2UoX1NVRkZJWCwgJycpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRleHQuc3RhcnRzV2l0aChfUFJFRklYX09CU09MRVRFKSAmJiB0ZXh0LmVuZHNXaXRoKF9TVUZGSVgpKSB7XHJcblx0XHRcdHJldHVybiB0ZXh0LnJlcGxhY2UoX1BSRUZJWF9PQlNPTEVURSwgJycpLnJlcGxhY2UoX1NVRkZJWCwgJycpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRleHQ7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGVuY29kZUVuY3J5cHRpb24oIGVuY3J5cHRlZFRleHQ6IHN0cmluZywgaGludDogc3RyaW5nICk6IHN0cmluZyB7XHJcblx0XHRpZiAoIWVuY3J5cHRlZFRleHQuY29udGFpbnMoX1BSRUZJWF9PQlNPTEVURSkgJiYgIWVuY3J5cHRlZFRleHQuY29udGFpbnMoX1BSRUZJWF9BKSAmJiAhZW5jcnlwdGVkVGV4dC5jb250YWlucyhfU1VGRklYKSkge1xyXG5cdFx0XHRpZiAoaGludCl7XHJcblx0XHRcdFx0cmV0dXJuIF9QUkVGSVhfQS5jb25jYXQoX0hJTlQsIGhpbnQsIF9ISU5ULCBlbmNyeXB0ZWRUZXh0LCBfU1VGRklYKTtcdFxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBfUFJFRklYX0EuY29uY2F0KGVuY3J5cHRlZFRleHQsIF9TVUZGSVgpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGVuY3J5cHRlZFRleHQ7XHJcblx0fVxyXG5cdFxyXG5cdC8vIERFUFJFQ0FURUQgYWJvdmVcclxufVxyXG5cclxuLy8gREVQUkVDQVRFRCBiZWxvd1xyXG5jbGFzcyBTZWxlY3Rpb25BbmFseXNpc3tcclxuXHRpc0VtcHR5OiBib29sZWFuO1xyXG5cdGhhc09ic29sZXRlRW5jcnlwdGVkUHJlZml4OiBib29sZWFuO1xyXG5cdGhhc0VuY3J5cHRlZFByZWZpeDogYm9vbGVhbjtcclxuXHRoYXNEZWNyeXB0U3VmZml4OiBib29sZWFuO1xyXG5cdGNhbkRlY3J5cHQ6IGJvb2xlYW47XHJcblx0Y2FuRW5jcnlwdDogYm9vbGVhbjtcclxuXHRjb250YWluc0VuY3J5cHRlZE1hcmtlcnM6IGJvb2xlYW47XHJcblx0ZGVjcnlwdGFibGUgOiBEZWNyeXB0YWJsZTtcclxufVxyXG5cclxuY2xhc3MgRW5jcnlwdGFibGV7XHJcblx0dGV4dDpzdHJpbmc7XHJcblx0aGludDpzdHJpbmc7XHJcbn1cclxuXHJcbmNsYXNzIERlY3J5cHRhYmxle1xyXG5cdHZlcnNpb246IG51bWJlcjtcclxuXHRiYXNlNjRDaXBoZXJUZXh0OnN0cmluZztcclxuXHRoaW50OnN0cmluZztcclxufVxyXG4vLyBERVBSRUNBVEVEIGFib3ZlIl0sIm5hbWVzIjpbIk1vZGFsIiwiUGxhdGZvcm0iLCJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyIsIlRleHRGaWxlVmlldyIsIk5vdGljZSIsIlBsdWdpbiIsIm1vbWVudCIsIm5vcm1hbGl6ZVBhdGgiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdURBO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUN0RyxRQUFRLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RSxLQUFLLENBQUMsQ0FBQztBQUNQOztBQzNFQTtBQUNxQixNQUFBLFlBQWEsU0FBUUEsY0FB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
