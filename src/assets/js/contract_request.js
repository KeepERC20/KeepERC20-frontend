/* send */
async function mint_contract(_contract, _account, _amount) {
    console.log("-- [request] mint");
    let response = await _contract.connect(_account).mint(_account.address, _amount);
    console.log("-- [response] mint :", response);
    return response;
}

async function createWallet_contract(_contract, _account) {
    console.log("-- [request] createWallet");
    let response = await _contract.connect(_account).createWallet();
    console.log("-- [response] createWallet :", response);
    return response;
}

async function approve_contract(_contract, _account, _spender, _amount) {
    console.log("-- [request] approve");
    let response = await _contract.connect(_account).approve(_spender, _amount);
    console.log("-- [response] approve :", response);
    return response;
}

async function queueScheduledTransferWithExtra_contract(_contract, _account, _to, _amount, _extra, _interval) {
    console.log("-- [request] queueScheduledTransferWithExtra");
    let response = await _contract.connect(_account).queueScheduledTransferWithExtra(_to, _amount, _extra, _interval);
    console.log("-- [response] queueScheduledTransferWithExtra :", response);
    return response;
}

async function queueRecoverableTransferWithExtra_contract(_contract, _account, _to, _amount, _extra, _interval) {
    console.log("-- [request] queueRecoverableTransferWithExtra");
    let response = await _contract.connect(_account).queueRecoverableTransferWithExtra(_to, _amount, _extra, _interval);
    console.log("-- [response] queueRecoverableTransferWithExtra :", response);
    return response;
}

async function queueExpirableApprove_contract(_contract, _account, _spender, _amount, _interval) {
    console.log("-- [request] queueExpirableApprove");
    let response = await _contract.connect(_account).queueExpirableApprove(_spender, _amount, _interval);
    console.log("-- [response] queueExpirableApprove :", response);
    return response;
}

/* view */
async function balanceOf_contract(_contract, _address) {
    let response = await _contract.balanceOf(_address);
    return response;
}

async function walletOf_contract(_contract, _address) {
    let response = await _contract.walletOf(_address);
    return response;
}

async function allowance_contract(_contract, _owner, _spender) {
    let response = await _contract.allowance(_owner, _spender);
    return response;
}

async function activeTasksOf_contract(_contract, _address) {
    let response = await _contract.tasksOf(_address);
    return response;
}

async function tasks_contract(_contract, _tid) {
    let response = await _contract.tasks(_tid);
    return response;
}

export { mint_contract, createWallet_contract, approve_contract, queueScheduledTransferWithExtra_contract, queueRecoverableTransferWithExtra_contract, queueExpirableApprove_contract };
export { balanceOf_contract, walletOf_contract, allowance_contract, activeTasksOf_contract, tasks_contract };