import React, {Component} from 'react'
import Merchants from '../components/Merchants'

type Props = {}

export default class MerchantsPage extends Component<Props> {
    props: Props

    render(){
        return <Merchants />
    }
}