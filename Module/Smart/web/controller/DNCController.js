$(() => {
    groupOrMachine = $("#groupOrMachine").multipleComboxTree({
        url: "/StatusDetail/GetAllMachineAndMachineGroup",
        url2: "/StatusDetail/GetKeywordMachinelist",
        type: 2,
        data: {
            GroupId: 0
        },
    }).data("BZ-multipleComboxTree");

    groupOrMachineR = $("#groupOrMachineR").multipleComboxTree({
        url: "/StatusDetail/GetAllMachineAndMachineGroup",
        url2: "/StatusDetail/GetKeywordMachinelist",
        type: 2,
        data: {
            GroupId: 0
        },
    }).data("BZ-multipleComboxTree");

    $('#send').click(() => {
        if (groupOrMachine.rData == undefined) { return; }
        let data = {};
        data.MAC_Nbr = groupOrMachine.rData;
        data.FullFileName = $('#Program').val();
        $.post('/DNC/SendProgram', data, (result) => {
            if (result.Status == 0) {
                BzSuccess("Success!");
            }
        })
    });
    $('#recevice').click(() => {
        if (groupOrMachineR.rData == undefined) { return; }
        let data = {};
        data.MAC_Nbr = groupOrMachineR.rData;
        data.FileName = $('#ProgramR').val();
        $.post('/DNC/ReceviceProgram', data, (result) => {
            if (result.Status == 0) {
                BzSuccess("Success!");
            }
        })
    })
})