import * as React from 'react';
import * as ReactRedux from 'react-redux';
import { SiteConfigContainer, SupportDiagnosticsContainer } from '../containers';
import { IAdminState, InstallationState } from '../reducers/AdminState';
import { IDisqusWordpressWindow } from '../reducers/AdminState';
import { getWordpressAdminUrl } from '../utils';
import AdminCard from './AdminCard';
import { IFormProps } from './FormProps';
import SupportLinks from './SupportLinks';

const WIN = window as IDisqusWordpressWindow;
const REST_OPTIONS = WIN.DISQUS_WP.rest;
const DISQUS_URL_BASE: string = 'https://disqus.com/';
const DISQUS_SIGNUP_URL: string = `${DISQUS_URL_BASE}profile/signup/`;
const DISQUS_LOGIN_URL: string = `${DISQUS_URL_BASE}profile/login/`;
const DISQUS_CREATE_URL: string = `${DISQUS_URL_BASE}admin/create/`;
const DISQUS_WORDPRESSBETA_URL: string = `${DISQUS_URL_BASE}admin/install/platforms/wordpressbeta/`;
const DISQUS_WORDPRESS_URL: string = `${DISQUS_URL_BASE}admin/install/platforms/wordpress/`;
const SYNCTOKEN_INPUT_ID = 'configKey';

/* tslint:disable:max-line-length */
class Install extends React.Component<IFormProps, any> {
    public render() {
        const syncToken = `${REST_OPTIONS.base}settings ${this.props.data.adminOptions.get('disqus_sync_token', '')}`;
        return (
            <div>
                <AdminCard title={__('Automatic Installation')}>
                    <p>
                        {__('Installs Disqus on your site using a generated API application. If your site isn\'t publicly accessible, use the manual installation method.')}
                    </p>
                    {this.getAutoInstallPrompt(syncToken)}
                </AdminCard>
                <AdminCard title={__('Manual Installation')}>
                    <p>
                        {__('You may install Disqus manually if you\'re not able to use the automatic installer.')}
                    </p>
                    <p className="submit">
                        <button className="button button-link" onClick={this.props.onToggleState.bind(null, 'isSiteFormLocked')}>
                            <span className={`dashicons dashicons-arrow-${this.props.data.isSiteFormLocked ? 'right' : 'down'}`} />
                            {' '}
                            {this.props.data.isSiteFormLocked ? __('Show manual configuration') : __('Hide manual configuration')}
                        </button>
                    </p>
                    {this.props.data.isSiteFormLocked ? null : <SiteConfigContainer />}
                </AdminCard>
                <AdminCard title={__('WordPress Comments')}>
                    <p className="description">
                        {__('Disqus has replaced the default WordPress commenting system. You may access and edit the comments in your database, but any actions performed there will not be reflected in Disqus.')}
                    </p>
                    <p className="submit">
                        <a
                            href={getWordpressAdminUrl('editComments')}
                            className="button"
                        >
                            {__('View WordPress Comments')}
                        </a>
                    </p>
                </AdminCard>
                <AdminCard title={__('Support')}>
                    <SupportLinks />
                    <hr />
                    <h3>
                        {__('Diagnostic Information')}
                    </h3>
                    <p className="description">
                        {__('Include the following information in any private support requests, but do not share this publicly.')}
                    </p>
                    <div className="submit">
                        <SupportDiagnosticsContainer />
                    </div>
                </AdminCard>
            </div>
        );
    }

    private getAutoInstallPrompt(syncToken: string) {
        switch (this.props.data.installationState) {
            case InstallationState.none:
                return (
                    <div>
                        <p className="submit">
                            <strong>Do you have a Disqus account?</strong>
                            <br />
                            <button
                                className="button"
                                onClick={this.props.onUpdateInstallationState.bind(null, InstallationState.hasAccount)}
                            >
                                Yes
                            </button>
                            {' '}
                            <button
                                className="button"
                                onClick={this.props.onUpdateInstallationState.bind(null, InstallationState.noAccount)}
                            >
                                No
                            </button>
                        </p>
                    </div>
                );
            case InstallationState.hasAccount:
                return (
                    <div>
                        <p className="submit">
                            <strong>Do you have a site registered on Disqus you want to use?</strong>
                            <br />
                            <button
                                className="button"
                                onClick={this.props.onUpdateInstallationState.bind(null, InstallationState.hasSite)}
                            >
                                Yes
                            </button>
                            {' '}
                            <button
                                className="button"
                                onClick={this.props.onUpdateInstallationState.bind(null, InstallationState.noSite)}
                            >
                                No
                            </button>
                        </p>
                    </div>
                );
            case InstallationState.noAccount:
                return (
                    <ol className="dsq-installation__instruction-list">
                        <li>
                            Sign up to register your account and site with Disqus
                            <br />
                            <button
                                className="button button-primary button-large"
                                onClick={this.openDisqusPage.bind(this, syncToken, `${DISQUS_SIGNUP_URL}?next=${encodeURIComponent(DISQUS_CREATE_URL)}`)}
                            >
                                {__('Sign up')}
                            </button>
                        </li>
                        <li>
                            After creating the site, go to the WordPress Beta installation page to finish.
                            <br />
                            <button
                                className="button"
                                onClick={this.openDisqusPage.bind(this, syncToken, `${DISQUS_LOGIN_URL}?next=${encodeURIComponent(DISQUS_WORDPRESSBETA_URL)}`)}
                            >
                                {__('WordPress Beta installation page')}
                            </button>
                        </li>
                        <li>
                            If needed, copy the sync token below and paste it to the input field in the installation page
                            <br />
                            <input
                                id={SYNCTOKEN_INPUT_ID}
                                type="text"
                                value={syncToken}
                                className="regular-text"
                                readOnly={true}
                            />
                            <button
                                className="button"
                                onClick={this.props.onCopyText.bind(null, SYNCTOKEN_INPUT_ID)}
                            >
                                {__('Copy')}
                            </button>
                        </li>
                        <li>
                            Click the Install button and finish configuring your Disqus settings
                        </li>
                    </ol>
                );
            case InstallationState.hasSite:
                return (
                    <ol className="dsq-installation__instruction-list">
                        <li>
                            Go to the WordPress Beta installation page
                            <br />
                            <button
                                className="button button-primary button-large"
                                onClick={this.openDisqusPage.bind(this, syncToken, `${DISQUS_LOGIN_URL}?next=${encodeURIComponent(DISQUS_WORDPRESSBETA_URL)}`)}
                            >
                                {__('WordPress Beta installation page')}
                            </button>
                        </li>
                        <li>
                            When prompted, choose the Disqus site you want to use
                        </li>
                        <li>
                            If needed, copy the sync token below and paste it to the input field in the installation page
                            <br />
                            <input
                                id={SYNCTOKEN_INPUT_ID}
                                type="text"
                                value={syncToken}
                                className="regular-text"
                                readOnly={true}
                            />
                            <button
                                className="button"
                                onClick={this.props.onCopyText.bind(null, SYNCTOKEN_INPUT_ID)}
                            >
                                {__('Copy')}
                            </button>
                        </li>
                        <li>
                            Click the Install button and finish configuring your Disqus settings
                        </li>
                    </ol>
                );
            case InstallationState.noSite:
                return (
                    <ol className="dsq-installation__instruction-list">
                        <li>
                            Create a new site on Disqus
                            <br />
                            <button
                                className="button button-primary button-large"
                                onClick={this.openDisqusPage.bind(this, syncToken, `${DISQUS_LOGIN_URL}?next=${encodeURIComponent(DISQUS_CREATE_URL)}`)}
                            >
                                {__('Create site')}
                            </button>
                        </li>
                        <li>
                            After creating the site, go to the WordPress Beta installation page to finish.
                            <br />
                            <button
                                className="button"
                                onClick={this.openDisqusPage.bind(this, syncToken, `${DISQUS_LOGIN_URL}?next=${encodeURIComponent(DISQUS_WORDPRESSBETA_URL)}`)}
                            >
                                {__('WordPress Beta installation page')}
                            </button>
                        </li>
                        <li>
                            If needed, copy the sync token below and paste it to the input field in the installation page
                            <br />
                            <input
                                id={SYNCTOKEN_INPUT_ID}
                                type="text"
                                value={syncToken}
                                className="regular-text"
                                readOnly={true}
                            />
                            <button
                                className="button"
                                onClick={this.props.onCopyText.bind(null, SYNCTOKEN_INPUT_ID)}
                            >
                                {__('Copy')}
                            </button>
                        </li>
                        <li>
                            Click the Install button and finish configuring your Disqus settings
                        </li>
                    </ol>
                );
            default:
                return null;
        }
    }

    /**
     * Opens a window to the publisher admin installation instructions and initializes communication between them.
     * @param syncToken - The token to send when the installation instructions are ready.
     * @param startUrl - The URL to load initially.
     */
    private openDisqusPage(syncToken: string, startUrl: string) {
        const win: Window = window.open(startUrl);
        const handlePostMessageEvent = (evt: MessageEvent) => {
            if (evt.origin.match(/https:\/\/(\w+).disqus.com/)) {
                switch (evt.data) {
                    case 'installPageReady':
                        // Pass the token information back to the install instructions page.
                        win.postMessage(syncToken, evt.origin);
                        break;
                    case 'configurationUpdated':
                        window.location.reload();
                        break;
                    default:
                        break;
                }
            }
        };
        window.addEventListener('message', handlePostMessageEvent, false);
    }
}
/* tslint:enable:max-line-length */

export default Install;
