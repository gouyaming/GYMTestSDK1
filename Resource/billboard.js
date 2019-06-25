import React, { Component } from 'react';
import ReactNative from 'react-native';
//import { AppRegistry, Text, View,ListView,requireNativeComponent,Image,NativeModules,TouchableWithoutFeedback,Dimensions,ScrollView,Animated,findNodeHandle,UIManager} from 'react-native';

const AppRegistry = require('react-native/Libraries/ReactNative/AppRegistry.js');
const Text = require('react-native/Libraries/Text/Text.js');
const View = require('react-native/lib/View.js');
const ListView = require('react-native/Libraries/Lists/ListView/ListView.js');
const requireNativeComponent = require('react-native/Libraries/ReactNative/requireNativeComponent.js');
const Image = require('react-native/Libraries/Image/Image.ios.js');
const NativeModules = require('react-native/Libraries/BatchedBridge/NativeModules.js');
const Dimensions = require('react-native/Libraries/Utilities/Dimensions.js');
const ScrollView = require('react-native/Libraries/Components/ScrollView/ScrollView.js');
const findNodeHandle = ReactNative.findNodeHandle;
const UIManager = require('react-native/Libraries/ReactNative/UIManager.js');

import {CardListV2} from '../cards/card_list_v2.js'
import {TitleBar} from '../title_bar.js'
import {RankDateButton} from '../cards/rank_date_button.js'

const QYRCTUtils = NativeModules.QYRCTUtils;
import QYRCTTapView from '../QYRCTTapView.js';
import QYRCTScrollSegmentView from '../QYRCTScrollSegmentView.js';
const cursor_width = 10;
const cursor_height = 2;

const QYRCTSkinManager = NativeModules.QYRCTSkinManager;

let originalDefaultProps = Text.defaultProps;
Text.defaultProps =  {
    ...originalDefaultProps,
    allowFontScaling: false,
};

class ChannelPannel extends Component {

	// constructor(props){
// 		super(props);
// 		var newState = {channelID:this.props.channelID};
// 		this.state = newState;
// 	}
	
	render(){
		var row = [];
		var rows = [];
		var scale = Dimensions.get('window').scale;
		var selected_channel_id = this.props.channelID;
		var channels = this.props.channels;
		var onChangeChannel = this.props.onChangeChannel;
		
		for(var i = 0 ; i < channels.length ; i++){
			var channel = channels[i];
			var txt = channel.txt;
			var txt_style = {color:'#333333',alignSelf:'center',fontSize:13};
			var tap_style = {flex:1,justifyContent:'center',height:40};
			var click_event_data = channel.click_event_data;
			var container_style = {height:30,flexDirection:'row',justifyContent:'center',alignSelf:'center'};
			var mask_style = {position:'absolute',top:0,left:-13,right:-13,bottom:0};
			if(click_event_data && click_event_data.tab_entity_id === selected_channel_id){
				txt_style.color = '#0bbe06';
				// container_style.backgroundColor='#f9f9f9';
 				mask_style.borderRadius=30;
// 				container_style.paddingLeft=15;
// 				container_style.paddingRight=15;
// 				tap_style.flex=0;
				mask_style.backgroundColor='#f5f5f5';
				mask_style.borderColor='#f2f2f2';
				mask_style.borderTopWidth = 0.5;
				mask_style.borderBottomWidth = 0.5;
			}
			
			var onPress = ((channelID)=>{
				return (()=>{
					onChangeChannel(channelID);
				});
			});
			
			var txt_element = (<View style={container_style}><View style={mask_style}/><Text style={txt_style}>{txt}</Text></View>);
			var txt_container = (<QYRCTTapView onPress={onPress(click_event_data.tab_entity_id)} key={i} style={tap_style}>
									{txt_element}
								</QYRCTTapView>);
			
			row.push(txt_container);
			
			if(row.length === 5){
				var row_element = (<View key={i} style={{flexDirection:'row',backgroundColor:'#fffffff4'}}>
									{row}
								</View>);
				rows.push(row_element);		
				row = [];		
			}
		}
		
		return (<View style={{backgroundColor:'white',borderColor:'#e7e7e7',borderBottomWidth:1/scale,paddingLeft:10.5,paddingRight:10.5}}>
					{rows}
				</View>);
	}
}

export class Billboard extends Component {

	
	constructor(props){
		super(props);
		this.state = {selected_idx:0,channelID:this.props.channelID,channel_pannel:0,rank_button:0};
		
	}
	
	onSelectedIdxChange = ((event)=>{
		var new_selected_idx=event.nativeEvent['new_idx'];
		var width = Dimensions.get('window').width;
		var newState = this.state;
		newState.selected_idx = new_selected_idx;
		this.setState(newState);
		//this.refs['scrollview'].scrollTo(0,width*new_selected_idx,true);
		this.refs['scrollview'].scrollTo({y: 0, x: width*new_selected_idx, animated: true})
		console.log(event.nativeEvent);
	})
	
	buildCardListArray(){
		var current_channel = this.getCurrentChannel();
		var tabs = current_channel.tabs;
		var card_list_array = [];
		for(var i = 0 ; i < tabs.length ; i++){
			var tab = tabs[i];
			var url = tab.url;

			var cardList = (
							<CardListV2 style={{width:Dimensions.get('window').width}} key={i} url={url}/>
						);
			card_list_array.push(cardList);
		}
		///this.card_list_array = card_list_array;
		return card_list_array;
	}

	
	getCurrentChannel(){
		var channels = this.props.channels;
		var selected_channel_id = this.state.channelID;
		
		for(var i = 0 ; i < channels.length ; i++){
			var channel = channels[i];
			var click_event_data = channel.click_event_data;
			if(click_event_data && click_event_data.tab_entity_id === selected_channel_id){
				var current_channel = channel;
			}
		}
		
		return current_channel;
	}
	
	componentDidMount(){
		console.log('component did mount@@@@@@');
		
		var segbar = this.refs['segbar'];
 		var segbar_handle = findNodeHandle(segbar);
 		
 		var scroll = this.refs['scrollview'];
 		var scroll_handle = findNodeHandle(scroll);

		UIManager.dispatchViewManagerCommand(
				  segbar_handle,
				  UIManager.QYRCTScrollSegmentView.Commands.bindScrollView,
				  [scroll_handle]
				);
	}
	
	render(){
	
		
		var current_channel = this.getCurrentChannel();
		var current_channel_title = current_channel.txt;
		
		var tabs = current_channel.tabs;
		
		var vc_key = this.props.vc_key;
		var selected_idx = this.state.selected_idx;
		
		var url = tabs[selected_idx].url;
		console.log('rendering url:'+url);
		
	
		
		var onChangeChannel = ((channel_id)=>{
			var newState = this.state;
			newState.channelID = channel_id;
			newState.channel_pannel = 0;
		//	this.buildCardListArray();
			this.setState(newState);	
		});
		
		var onRightBtn = (()=>{
			console.log('click right btn');
			var show_pannel = this.state.channel_pannel;
			var newState = this.state;
			newState.channel_pannel = !show_pannel;
			
			this.setState(newState);
			
			console.log(newState);
		});
		var channel_pannel = (this.state.channel_pannel == 1);
		var rank_date_button = (this.state.rank_date_button === 1);
		
		var img_name = channel_pannel ? QYRCTSkinManager.rank_channel_normal_btn:QYRCTSkinManager.rank_channel_extend_btn;
		var window_width = Dimensions.get('window').width;
		
		
		
		//{<BillboardTabBar tabs={tabs} onSelectedIdxChange={this.onSelectedIdxChange} selected_idx={this.state.selected_idx}/>}
		
		return (<View style={{flex:1}}>
					<TitleBar right_btn={{title:current_channel_title,onClick:onRightBtn,image:img_name}} vc_key={vc_key} title={this.props.title}/>
					
					<QYRCTScrollSegmentView onSelectedIdxChange={this.onSelectedIdxChange} tabs={tabs} ref={'segbar'} style={{height:41}}/>
					<View style={{flex:1}}>
						{
							rank_date_button && <RankDateButton/>
						}
						<ScrollView  ref={'scrollview'} style={{width:window_width}} horizontal={true} pagingEnabled={true}>
							{this.buildCardListArray()}
						</ScrollView>
						{
							channel_pannel && ( <View style={{position:'absolute',left:0,right:0,top:0}}>
								<ChannelPannel onChangeChannel={onChangeChannel} channels={this.props.channels} channelID={this.state.channelID}/>
							</View>)
						}
						
					</View>
					
				</View>);
		
	}
}

AppRegistry.registerComponent('Billboard',()=>Billboard);