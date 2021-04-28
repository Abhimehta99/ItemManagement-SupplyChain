// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract ItemManager{

    enum SupplyChainSteps{Created, Paid, Delivered}

    struct S_Item {
        ItemManager.SupplyChainSteps _step;
        string _identifier;
        uint _itemIndex;   
        uint unique;     
    }
    mapping(uint => S_Item) public items;
    
    event SupplyChainStep(uint _itemIndex, uint _step, uint unique);

    function createItem(string memory _identifier, uint _itemIndex) public{

        items[_itemIndex]._step = SupplyChainSteps.Created;
        items[_itemIndex]._identifier = _identifier;
        items[_itemIndex].unique = 1;
        emit SupplyChainStep(_itemIndex, uint(items[_itemIndex]._step), uint(items[_itemIndex].unique));
    }

    function triggerPayment(uint _itemIndex) public{
        items[_itemIndex]._step = SupplyChainSteps.Paid;
        emit SupplyChainStep(_itemIndex, uint(items[_itemIndex]._step), uint(items[_itemIndex].unique));
    }

    function triggerDelivery(uint _itemIndex) public{
        items[_itemIndex]._step = SupplyChainSteps.Delivered;
        emit SupplyChainStep(_itemIndex, uint(items[_itemIndex]._step), uint(items[_itemIndex].unique));
    }

    function trackOrder(uint index) public view returns(S_Item memory) {
        return items[index];
    }
}