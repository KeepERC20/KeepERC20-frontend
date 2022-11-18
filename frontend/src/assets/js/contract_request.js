/* send */
async function mint_contract(_contract, _account, _amount) {
    console.log("-- [request] mint");
    let response = await _contract.methods.mint(_account, _amount).send({ from: _account });
    console.log("-- [response] mint :", response);
    return response;
}

async function createWallet_contract(_contract, _account) {
    console.log("-- [request] createWallet");
    let response = await _contract.methods.createWallet().send({ from: _account });
    console.log("-- [response] createWallet :", response);
    return response;
}

async function approve_contract(_contract, _account, _spender, _amount) {
    console.log("-- [request] approve");
    let response = await _contract.methods.approve(_spender, _amountl).send({ from: _account });
    console.log("-- [response] approve :", response);
    return response;
}

async function queueScheduledTransferWithExtra_contract(_contract, _account, _to, _amount, _extra, _interval) {
    console.log("-- [request] queueScheduledTransferWithExtra");
    let response = await _contract.methods.queueScheduledTransferWithExtra(_to, _amount, _extra, _interval).send({ from: _account });
    console.log("-- [response] queueScheduledTransferWithExtra :", response);
    return response;
}

async function queueRecoverableTransferWithExtra_contract(_contract, _account, _to, _amount, _extra, _interval) {
    console.log("-- [request] queueRecoverableTransferWithExtra");
    let response = await _contract.methods.queueRecoverableTransferWithExtra(_to, _amount, _extra, _interval).send({ from: _account });
    console.log("-- [response] queueRecoverableTransferWithExtra :", response);
    return response;
}

async function queueExpirableApprove_contract(_contract, _account, _spender, _amount, _interval) {
    console.log("-- [request] queueExpirableApprove");
    let response = await _contract.methods.queueExpirableApprove(_spender, _amount, _interval).send({ from: _account });
    console.log("-- [response] queueExpirableApprove :", response);
    return response;
}

/* view */
async function balanceOf_contract(_contract, _account) {
    let response = await _contract.methods.balanceOf(_account).call();
    return response;
}

async function walletOf_contract(_contract, _account) {
    let response = await _contract.methods.walletOf(_account).call();
    return response;
}

async function allowance_contract(_contract, _owner, _spender) {
    let response = await _contract.methods.allowance(_owner, _spender).call();
    return response;
}

async function activeTasksOf_contract(_contract, _account) {
    let response = await _contract.methods.tasksOf(_account).call();
    return response;
}

async function tasks_contract(_contract, _tid) {
    let response = await _contract.methods.tasks(_tid).call();
    return response;
}

export { mint_contract, createWallet_contract, approve_contract, queueScheduledTransferWithExtra_contract, queueRecoverableTransferWithExtra_contract, queueExpirableApprove_contract };
export { balanceOf_contract, walletOf_contract, allowance_contract, activeTasksOf_contract, tasks_contract };