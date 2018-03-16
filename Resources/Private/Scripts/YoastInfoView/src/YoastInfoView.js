import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get} from 'plow-js';
import {neos} from '@neos-project/neos-ui-decorators';
import {selectors} from '@neos-project/neos-ui-redux-store';
import style from './style.css';

@connect(state => ({
    siteNode: selectors.CR.Nodes.siteNodeSelector(state)
}))
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class YoastInfoView extends PureComponent {
    static propTypes = {
        commit: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired
    }

    render() {
        const {siteNode, i18nRegistry} = this.props;

        const properties = {
            identifier: $get('identifier', siteNode),
            created: $get('properties._creationDateTime', siteNode),
            lastModification: $get('properties._lastModificationDateTime', siteNode),
            lastPublication: $get('properties._lastPublicationDateTime', siteNode),
            path: $get('properties._path', siteNode),
            name: $get('properties._name', siteNode) ? $get('properties._name', siteNode) : '/'
        };

        const nodeType = $get('nodeType', siteNode);

        return (
            <ul className={style.yoastInfoView}>
                <li className={style.yoastInfoView__item} title={new Date(properties.created).toLocaleString()}>
                    <div className={style.yoastInfoView__title}>{i18nRegistry.translate('created', 'Created', {}, 'Neos.Neos')}</div>
                    <yoastInfoViewContent>{new Date(properties.created).toLocaleString()}</yoastInfoViewContent>
                </li>
                <li className={style.yoastInfoView__item} title={new Date(properties.lastModification).toLocaleString()}>
                    <div className={style.yoastInfoView__title}>{i18nRegistry.translate('lastModification', 'Last modification', {}, 'Neos.Neos')}</div>
                    <yoastInfoViewContent>{new Date(properties.lastModification).toLocaleString()}</yoastInfoViewContent>
                </li>
                {properties.lastPublication ? (<li className={style.yoastInfoView__item} title={new Date(properties.lastPublication).toLocaleString()}>
                    <div className={style.yoastInfoView__title}>{i18nRegistry.translate('lastPublication', 'Last publication', {}, 'Neos.Neos')}</div>
                    <yoastInfoViewContent>{new Date(properties.lastPublication).toLocaleString()}</yoastInfoViewContent>
                </li>) : []}
                <li className={style.yoastInfoView__item} title={properties.identifier}>
                    <div className={style.yoastInfoView__title}>{i18nRegistry.translate('identifier', 'Identifier', {}, 'Neos.Neos')}</div>
                    <yoastInfoViewContent>{properties.identifier}</yoastInfoViewContent>
                </li>
                <li className={style.yoastInfoView__item} title={properties.path}>
                    <div className={style.yoastInfoView__title}>{i18nRegistry.translate('name', 'Name', {}, 'Neos.Neos')}</div>
                    <yoastInfoViewContent>{properties.name}</yoastInfoViewContent>
                </li>
                <li className={style.yoastInfoView__item} title={nodeType}>
                    <div className={style.yoastInfoView__title}>{i18nRegistry.translate('type', 'Type', {}, 'Neos.Neos')}</div>
                    <yoastInfoViewContent>{nodeType}</yoastInfoViewContent>
                </li>
            </ul>
        );
    }
}

/**
 * Handles the automatic selection of it's content to ease copy&paste
 */
class YoastInfoViewContent extends PureComponent {
    static propTypes = {
        children: PropTypes.node
    };

    handleReference = ref => {
        this.element = ref;
    }

    handleClick = () => {
        if (this.element) {
            window.getSelection().selectAllChildren(this.element);
        }
    }

    render() {
        return (
            <div
                role="button"
                ref={this.handleReference}
                className={style.yoastInfoView__content}
                onClick={this.handleClick}
                >
                {this.props.children}
            </div>
        );
    }
}
