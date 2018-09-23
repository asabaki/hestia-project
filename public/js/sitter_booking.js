
/*=============เกี่ยวกับวัน============*/
var d = new Date()
var todayYear =d.getFullYear();
var todayMonth =(d.getMonth()+1);
var todayDate =(d.getDate());
var start,end,startDate,endDate,oneDay,diff;

var starDate,startMonth,startYear,startDay,maxDate;

var nowDate,nowTime;
var n,i;

var timeSlot='<tr class="timeSelector">'+
                '<td class="account-setting-td timeOfDay" >Time : </td>'+
                '<td class="account-setting-td">'+
                        '<select name="service" id="fromTime" class="timeSlot">'+
                            '<option value="" selected="selected" disabled>From</option>'+
                            '<option value="0">12.00 am</option>'+
                            '<option value="1">1.00 am</option>'+
                            '<option value="2">2.00 am</option>'+
                            '<option value="3">3.00 am</option>'+
                            '<option value="4">4.00 am</option>'+
                            '<option value="5">5.00 am</option>'+
                            '<option value="6">6.00 am</option>'+
                            '<option value="7">7.00 am</option>'+
                            '<option value="8">8.00 am</option>'+
                            '<option value="9">9.00 am</option>'+
                            '<option value="10">10.00 am</option>'+
                            '<option value="11">11.00 am</option>'+
                            '<option value="12">12.00 pm</option>'+
                            '<option value="13">1.00 pm</option>'+
                            '<option value="14">2.00 pm</option>'+
                            '<option value="15">3.00 pm</option>'+
                            '<option value="16">4.00 pm</option>'+
                            '<option value="17">5.00 pm</option>'+
                            '<option value="18">6.00 pm</option>'+
                            '<option value="19">7.00 pm</option>'+
                            '<option value="20">8.00 pm</option>'+
                            '<option value="21">9.00 pm</option>'+
                            '<option value="22">10.00 pm</option>'+
                            '<option value="23">11.00 pm</option>'+
                        '</select> to '+
                        '<select name="service" id="toTime" class="timeSlot">'+
                            '<option value="" selected="selected" disabled>To</option>'+
                            '<option value="0">12.00 am</option>'+
                            '<option value="1">1.00 am</option>'+
                            '<option value="2">2.00 am</option>'+
                            '<option value="3">3.00 am</option>'+
                            '<option value="4">4.00 am</option>'+
                            '<option value="5">5.00 am</option>'+
                            '<option value="6">6.00 am</option>'+
                            '<option value="7">7.00 am</option>'+
                            '<option value="8">8.00 am</option>'+
                            '<option value="9">9.00 am</option>'+
                            '<option value="10">10.00 am</option>'+
                            '<option value="11">11.00 am</option>'+
                            '<option value="12">12.00 pm</option>'+
                            '<option value="13">1.00 pm</option>'+
                            '<option value="14">2.00 pm</option>'+
                            '<option value="15">3.00 pm</option>'+
                            '<option value="16">4.00 pm</option>'+
                            '<option value="17">5.00 pm</option>'+
                            '<option value="18">6.00 pm</option>'+
                            '<option value="19">7.00 pm</option>'+
                            '<option value="20">8.00 pm</option>'+
                            '<option value="21">9.00 pm</option>'+
                            '<option value="22">10.00 pm</option>'+
                            '<option value="23">11.00 pm</option>'+
                        '</select>'+
                '</tr>';

var sitter='<tr class="paymentMethod_selectedCard " id="sitter1">'+
                '<td>'+
                    '<input type="radio" name=""  >'+
                '</td>'+
                '<td>kanpichcha</td>'+
                '<td>Pet sitter</td>'+
                '<td>Licensed</td>'+   
                '<td>English</td> '+  
                '<td>'+
                    '<div class="starr starr-dashboard request-sitter_star">'+
                        '<p>3</p>'+
                    '</div>'+
                '</td>'+   
                '<td>200</td>'+   
                '<td>'+
                    '<img src="https://images.unsplash.com/photo-1537326890127-d87a3c8336d5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e36e60ea8dc951f2838acdef5fa4cc50&auto=format&fit=crop&w=1650&q=80" alt="" class="paymentMethod_selectedCard-img request-sitter_img">'+
                '</td>'+  
            '</tr>';
var house_detail_input='<tr id="house_detail_input1">'+
                            '<td class="account-setting-td" style="background-color: #f1fcff;"><label>House Address </label></td>'+
                            '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                                '<textarea  name="house_address" class="account-setting-input bookingDetail_textarea"></textarea>'+
                            '</td>'+
                        '</tr>'+
                        '<tr id="house_detail_input2">'+
                            '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Detail </label></td>'+
                            '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                                '<textarea  name="house_detail" class="account-setting-input bookingDetail_textarea"></textarea>'+
                            '</td>'+
                        '</tr>';
var baby_detail_input='<tr id="baby_detail_input1">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Kid name</label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<input type="text" name="baby_name" class="account-setting-input">'+
                        '</td>'+
                    '</tr>'+
                    '<tr id="baby_detail_input2">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Kid age</label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<input type="text" name="baby_age" class="account-setting-input">'+
                        '</td>'+
                    '</tr>'+
                    '<tr id="baby_detail_input5">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Gender</label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<select name="baby_gender">'+
                                '<option value="0" disabled selected>Gender</option>'+
                                '<option value="male">Male</option>'+
                                '<option value="female">Female</option>'+
                                '<option value="other">Other</option>'+
                            '</select>'+
                        '</td>'+
                    '</tr>'+
                    '<tr id="baby_detail_input3">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Physically/Mentally Challenged?</label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<input type="radio" name="disability" class="bookingDetail_radio" value="0" > No</input>'+
                            '<br>'+
                            '<input type="radio" name="disability" class="bookingDetail_radio" value="1" > Yes</input>'+
                        '</td>'+
                    '</tr>'+
                    
                    '<tr id="baby_detail_input4">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Kid Detail </label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<textarea  name="baby_detail" class="account-setting-input bookingDetail_textarea"></textarea>'+
                        '</td>'+
                    '</tr>';
var pet_detail_input='<tr id="pet_detail_input1" >'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Type of pet</label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<input type="text" name="pet_type" class="account-setting-input">'+
                        '</td>'+
                    '</tr>'+
                    '<tr id="pet_detail_input2">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Breed</label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<input type="text" name="pet_breed" class="account-setting-input">'+
                        '</td>'+      
                    '</tr>'+   
                    '<tr id="pet_detail_input3">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Pet age</label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<input type="text" name="pet_age" class="account-setting-input">'+
                        '</td>'+      
                    '</tr>'+  
                    '<tr id="pet_detail_input7">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Pet name</label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<input type="text" name="pet_name" class="account-setting-input">'+
                        '</td>'+      
                    '</tr>'+  
                    '<tr id="pet_detail_input6">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Gender</label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<select name="pet_gender">'+
                                '<option value="0" disabled selected>Gender</option>'+
                                '<option value="male">Male</option>'+
                                '<option value="female">Female</option>'+
                                '<option value="other">Other</option>'+
                            '</select>'+
                        '</td>'+
                    '</tr>'+
                    '<tr id="pet_detail_input4">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Physically/Mentally Challenged?</label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<input type="radio" name="disability" class="bookingDetail_radio" value="0" > No</input>'+
                            '<br>'+
                            '<input type="radio" name="disability" class="bookingDetail_radio" value="1" > Yes</input>'+
                        '</td>'+
                    '</tr>'+
                    '<tr id="pet_detail_input5">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Pet Detail </label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<textarea  name="pet_detail" class="account-setting-input bookingDetail_textarea"></textarea>'+
                        '</td>'+
                    '</tr>';
var elder_detail_input='<tr id="elder_detail_input1">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Name</label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<input type="text" name="elder_name" class="account-setting-input">'+
                        '</td>'+
                    '</tr>'+
                    '<tr id="elder_detail_input2">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Age</label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<input type="text" name="elder_age" class="account-setting-input">'+
                        '</td>'+
                    '</tr>'+
                    '<tr id="baby_detail_input5">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Gender</label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<select name="elder_gender">'+
                                '<option value="0" disabled selected>Gender</option>'+
                                '<option value="male">Male</option>'+
                                '<option value="female">Female</option>'+
                                '<option value="other">Other</option>'+
                            '</select>'+
                        '</td>'+
                    '</tr>'+
                    '<tr id="elder_detail_input3">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Physically/Mentally Challenged?</label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<input type="radio" name="disability" class="bookingDetail_radio" value="0" > No</input>'+
                            '<br>'+
                            '<input type="radio" name="disability" class="bookingDetail_radio" value="1" > Yes</input>'+
                        '</td>'+
                    '</tr>'+
                    '<tr id="elder_detail_input4">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Elder person Detail </label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<textarea  name="elder_detail" class="account-setting-input bookingDetail_textarea"></textarea>'+
                        '</td>'+
                    '</tr>';
var disability_detail_input='<tr id="disability_detail_input1">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Name</label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<input type="text" name="disability_name" class="account-setting-input">'+
                        '</td>'+
                    '</tr>'+
                    '<tr id="disability_detail_input2">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Age</label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<input type="text" name="diability_age" class="account-setting-input">'+
                        '</td>'+
                    '</tr>'+
                    '<tr id="baby_detail_input5">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Gender</label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<select name="disability_gender">'+
                                '<option value="0" disabled selected>Gender</option>'+
                                '<option value="male">Male</option>'+
                                '<option value="female">Female</option>'+
                                '<option value="other">Other</option>'+
                            '</select>'+
                        '</td>'+
                    '</tr>'+
                    '<tr id="disability_detail_input3">'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Person Detail </label></td>'+
                        '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                            '<textarea  name="disabiliy_detail" class="account-setting-input bookingDetail_textarea"></textarea>'+
                        '</td>'+
                    '</tr>';
                    
var disability_detail='<tr id="disability_detail">'+
                            '<td class="account-setting-td" style="background-color: #f1fcff;"><label>Physically/Mentally Challenged Detail</label></td>'+
                            '<td class="account-setting-td" style="background-color: #f1fcff;">'+
                                '<textarea  name="disabilityDetail" class="account-setting-input bookingDetail_textarea"></textarea>'+
                            '</td>'+
                        '</tr>';
                    
/*======= service =========*/                 
$('select#service').on('change',function(){
    
    $("[id*='_detail_input']").remove();
    
    var s=$('select#service').val();
    console.log(s);
    if(s=="house")
    {
        $(house_detail_input).insertAfter('tr#service_type_selector');
    }
    else if(s=="baby")
    {
        $(baby_detail_input).insertAfter('tr#service_type_selector');
        $('input[type=radio].bookingDetail_radio').on('change',function(){
            var disability_selected=$(this).val();
            if(disability_selected=="1")
            {
                $(disability_detail).insertAfter('tr#baby_detail_input3');
            }
            else if(disability_selected=="0")
            {
                $('tr#disability_detail').remove();
            }
        });
    }
    else if(s=="pet")
    {
        $(pet_detail_input).insertAfter('tr#service_type_selector');
        $('input[type=radio].bookingDetail_radio').on('change',function(){
            var disability_selected=$(this).val();
            if(disability_selected=="1")
            {
                $(disability_detail).insertAfter('tr#pet_detail_input4');
            }
            else if(disability_selected=="0")
            {
                $('tr#disability_detail').remove();
            }
        });
    }
    else if(s=="elder")
    {
        $(elder_detail_input).insertAfter('tr#service_type_selector');
        $('input[type=radio].bookingDetail_radio').on('change',function(){
            var disability_selected=$(this).val();
            if(disability_selected=="1")
            {
                $(disability_detail).insertAfter('tr#elder_detail_input3');
            }
            else if(disability_selected=="0")
            {
                $('tr#disability_detail').remove();
            }
        });
    }
    else if(s=="disability")
    {
        $(disability_detail_input).insertAfter('tr#service_type_selector');
        $(disability_detail).insertAfter('tr#disability_detail_input3');
    }
});


if(todayMonth.toLocaleString().length==1)
{
    todayMonth="0"+todayMonth;
}

var today = todayYear+ "-" + todayMonth + "-" + todayDate;
$( 'input#startDate' ).attr('min', today);


$('input#startDate').on('change', function(){
    start=$(this).val();

/*=============เลืิิกเวลา============*/
    $('tr.timeSelector').remove();
    $('tbody#booking').append(timeSlot);
    
/*=============เวลาที่เลือกได้============*/
    if(start == today)
    {
        nowDate = new Date();
        nowTime = nowDate.getHours()+2;
        console.log(nowTime);
        for(i=1;i<=24;i++)
        {
            var tempTime = $('#fromTime > option:eq('+i+')').val();
            if(tempTime <= nowTime)
            {
                $('#fromTime > option:eq('+i+')').prop('disabled', true); 
            }
        }
    }
    var fromTime,temp;
    $('#fromTime').on('change',function(){
    fromTime=$('#fromTime').val();
    console.log("fromTime: "+fromTime);
    
    for(i=fromTime;i>-2;i--)
    {
        $('#toTime > option:eq('+(i+2)+')').prop('disabled', true); 
    }
    });
    
    
    $('#toTime').on('change',function(){
        /*====== sitter list =======*/ 
        $('#sitter1').empty();
        $('#sitter1').remove();
        
        if($('#sitterList_table').css("visibility", "visible"))
        {
            console.log("if");
            $('#sitterList_table').css("visibility", "hidden");
            $('#sitter1').empty();
            if( $('#sitterList_table').css("visibility", "hidden"))
            {
                console.log("if2");
                $('#sitterList_table').css("visibility", "visible");
                $('table#sitterList_table').append(sitter);
            }
            /* ======= star ========*/
            $('span.fa.fa-star').remove();
            $('span.fa.fa-star').empty();
            var newSpan='<span class="fa fa-star"></span>' + 
                        '<span class="fa fa-star"></span>'+ 
                        '<span class="fa fa-star"></span>'+ 
                        '<span class="fa fa-star"></span>'+ 
                        '<span class="fa fa-star"></span>';
    
            $(".starr").append(newSpan);
            var nRate=$(".starr p").size();
            for(let j=0;j<nRate;j++)
            {
                var rate=$(".starr p:eq("+j+")").text();
                for(let i=0;i<rate;i++)
                {
                    $( ".starr:eq("+j+") span.fa.fa-star:eq("+i+")" ).addClass("checked")
                }
            }
            $('.request-sitter_star p').empty();
        }
        else
        {
            $('#sitterList_table').css("visibility", "visible");
            $('table#sitterList_table').append(sitter);

            /* ======= star ========*/
            $('.fa.fa-star').remove();
            var newSpan='<span class="fa fa-star"></span>' + 
                        '<span class="fa fa-star"></span>'+ 
                        '<span class="fa fa-star"></span>'+ 
                        '<span class="fa fa-star"></span>'+ 
                        '<span class="fa fa-star"></span>';
    
            $(".starr").append(newSpan);
            var nRate=$(".starr p").size();
            for(let j=0;j<nRate;j++)
            {
                var rate=$(".starr p:eq("+j+")").text();
                for(let i=0;i<rate;i++)
                {
                    $( ".starr:eq("+j+") span.fa.fa-star:eq("+i+")" ).addClass("checked")
                }
            }
            $('.request-sitter_star p').empty();
        }
       
    
            
    });
});

