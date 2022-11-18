/* send */
async function mint_contract(_contract, _account, _amount) {
    console.log("-- [request] mint");
    let response = await _contract.methods.mint(_account, _amount).send({ from: _account });
    console.log("-- [response] mint :", response);
    return response;
}

/* view */
async function balanceOf_contract(_contract, _account) {
    let response = await _contract.methods.balanceOf(_account).call();
    return response;
}

export { mint_contract };
export { balanceOf_contract };