<?php
/**
 * Created by PhpStorm.
 * User: simonezhou
 * Date: 2016/4/28
 * Time: 22:36
 */

namespace App\Controller;

use Cake\Core\Configure;
use Cake\ORM\TableRegistry;

class AccountController extends BaseController
{
    private $accountTable;
    private $parameterTable;

    public function initialize () {
        parent::initialize();

        $this -> accountTable = TableRegistry::get('Account');
        $this -> parameterTable = TableRegistry::get('Parameter');
    }

    //获取支出或收入页面信息，初始化页面(api)
    public function getAccountData() {
        $this -> autoRender = false;
        $ret = array('code' => 1, 'info' => '','data' => array());

        if ($this -> userState == Configure::read('LOGOUT_USER')) {
            $ret['code'] = 0;
            $ret['info'] = '已退出';
        } else if ($this -> request -> is('ajax')) {
            $page = $this -> request -> query('page');
            $ret['data']['formList'] = $this -> _getAccountFormList($page);
            $ret['data']['edit'] = $this -> _getEditSelect($page);
        }

        $this -> response -> body(json_encode($ret));
    }

    //保存支出或收入表单信息(api)
    public function saveAccount() {
        $this -> autoRender = false;
        $ret = array('code' => 1, 'info' => '', 'data' => '');

        if ($this -> userState == Configure::read('LOGOUT_USER')) {
            $ret['code'] = 0;
            $ret['info'] = '已退出';
        } else {
            //保存新支出
            $page = $this -> request -> query('page');
            $newAccount = $this -> accountTable -> newEntity();

            $accountDescribed = $this -> request -> data('described');
            $accountItem = $this -> request -> data('item');
            $accountMethod = $this -> request -> data('method');
            $accountMember = $this -> request -> data('member');
            $accountDate = $this -> request -> data('date');
            if ($page == 'income') {
                $accountQuantity = 1;
                $accountUnitPrice = 1;
                $accountSeller = 0;
                $accountSum = $this -> request -> data('sum');

                $newAccount -> classify_id = Configure::read('INCOME_ACCOUNT');
            } else if ($page == 'expense') {
                $accountQuantity = $this -> request -> data('quantity');
                $accountUnitPrice = $this -> request -> data('unit_price');
                $accountSeller = $this -> request -> data('seller');
                $accountSum = $accountQuantity * $accountUnitPrice;

                $newAccount -> classify_id = Configure::read('EXPENSE_ACCOUNT');
            }

            $newAccount -> user_id = $this -> userState;
            $newAccount -> described = $accountDescribed;
            $newAccount -> seller_id = $accountSeller;
            $newAccount -> sum = $accountSum;
            $newAccount -> unit_price = $accountUnitPrice;
            $newAccount -> quantity = $accountQuantity;
            $newAccount -> item_id = $accountItem;
            $newAccount -> method_id = $accountMethod;
            $newAccount -> member_id = $accountMember;
            $newAccount -> date = $accountDate;

            $this -> accountTable -> save($newAccount);
        }

        $this -> response -> body (json_encode($ret));
    }

    //更新支出或收入表单数据(api)
    public function editorAccountData() {
        $this -> autoRender = false;
        $ret = array('data' => array(), 'options' => array(), 'files' => array());
        $page = $this -> request -> query('page');
        $editData = $this -> request -> data('data');

        if ($this -> userState == Configure::read('LOGOUT_USER')) {
            $ret['code'] = 0;
            $ret['info'] = '已退出';
        } else if ($this -> request -> is('ajax')) {
            if ($this -> request -> data('action') == 'edit') {
                if ($page == 'expense') {
                    foreach ($editData as $key => $val) {
                        $account_id = $val['account_id'];
                        $date = $val['date'];
                        $described = $val['described'];
                        $item_id = $val['item_name_2'];
                        $member_id = $val['member_name'];
                        $method_id = $val['method_name'];
                        $seller_id = $val['seller_name'];
                        $quantity = $val['quantity'];
                        $unit_price = $val['unit_price'];
                        $sum = $quantity * $unit_price;

                        $query = $this -> accountTable -> query();
                        $query -> update()
                            -> set([ 'date' => $date, 'item_id' => $item_id, 'described' => $described,
                                'member_id' => $member_id, 'method_id' => $method_id,
                                'seller_id' => $seller_id, 'quantity' => $quantity,
                                'unit_price' => $unit_price, 'sum' => $sum ])
                            -> where(['account_id' => $account_id])
                            -> execute();
                    }
                }
                if ($page == 'income') {
                    foreach ($editData as $key => $val) {
                        $account_id = $val['account_id'];
                        $described = $val['described'];
                        $date = $val['date'];
                        $item_id = $val['item_name'];
                        $member_id = $val['member_name'];
                        $method_id = $val['method_name'];
                        $sum = $val['sum'];

                        $query = $this -> accountTable -> query();
                        $query -> update()
                            -> set([ 'date' => $date, 'item_id' => $item_id, 'described' => $described,
                                'member_id' => $member_id, 'method_id' => $method_id,
                                'sum' => $sum ])
                            -> where(['account_id' => $account_id])
                            -> execute();
                    }
                }
            } else if ($this -> request -> data('action') == 'remove') {

                foreach ($editData as $key => $val) {
                    $query = $this -> accountTable -> query();
                    $query -> delete() -> where(['account_id' => $val['account_id']]) -> execute();
                }
                
            }

            $ret['data'] = $this -> _getAccountList($page);
        }

        $this -> response -> body(json_encode($ret));
    }

    //获取编辑选项
    private function _getEditSelect($page) {
        $this -> autoRender = false;
        $ret = array();
        if ($page == 'expense') {
            $ret['item'] = $this -> _getExpenseItemList(Configure::read('Parameter.expense_item'), true);
            $ret['seller'] = $this -> _getOtherList(Configure::read('Parameter.seller'), true);
        }
        if ($page == 'income') {
            $ret['item'] = $this -> _getOtherList(Configure::read('Parameter.income_item'), true);
        }
        $ret['method'] = $this -> _getOtherList(Configure::read('Parameter.method'), true);
        $ret['member'] = $this -> _getOtherList(Configure::read('Parameter.member'), true);
        return $ret;
    }

    //获取支出或收入数据信息
    private function _getAccountList ($page) {
        $this -> autoRender = false;
        $ret = array();
        $classify_id = $page == 'income' ? Configure::read('INCOME_ACCOUNT') : Configure::read('EXPENSE_ACCOUNT');

        $query = $this -> accountTable -> find() -> contain(['Item', 'Method', 'Member', 'Seller']);
        $query = $query -> where(['classify_id' => $classify_id, 'user_id' => $this -> userState]);
        $result = $query -> toList();

        $i = 1;
        foreach ($result as $row) {
            if ($page == 'income') {
                array_push($ret, array(
                        'DT_RowId' => 'row_'.$i++,
                        'account_id' => $row['account_id'],
                        'described' => $row['described'],
                        'date' => date('Y-m-d', strtotime($row['date'])),
                        'item_name' => $row['item']['name'],
                        'method_name' => $row['method']['name'],
                        'member_name' => $row['member']['name'],
                        'sum' => $row['sum']
                    )
                );
            }
            if ($page == 'expense') {
                array_push($ret, array(
                        'DT_RowId' => 'row_'.$i++,
                        'account_id' => $row['account_id'],
                        'date' => date('Y-m-d', strtotime($row['date'])),
                        'described' => $row['described'],
                        'item_name_2' => $row['item']['name'],
                        'seller_name' => $row['seller']['name'],
                        'method_name' => $row['method']['name'],
                        'member_name' => $row['member']['name'],
                        'unit_price' => $row['unit_price'],
                        'quantity' => $row['quantity'],
                        'sum' => $row['sum']
                    )
                );
            }
        }

        return $ret;
    }

    //获取支出或收入表单信息
    private function _getAccountFormList ($page) {
        $this -> autoRender = false;
        $ret = array();

        if ($page == 'income') {
            $ret['item'] = $this -> _getOtherList(Configure::read('Parameter.income_item'));
        }
        
        if ($page == 'expense') {
            $ret['item'] = $this -> _getExpenseItemList(Configure::read('Parameter.expense_item'));
            $ret['seller'] = $this -> _getOtherList(Configure::read('Parameter.seller'));
        }

        $ret['method'] = $this -> _getOtherList(Configure::read('Parameter.method'));
        $ret['member'] = $this -> _getOtherList(Configure::read('Parameter.member'));

        return $ret;
    }

    //获取支出项目级联选项
    private function _getExpenseItemList ($parameterId, $edit = false) {
        if ($edit) {
            $ret = array('first_level' => array(), 'second_level' => array());
        } else {
            $ret = array();
        }

        $primaryQuery = $this -> parameterTable -> find() -> where(['parent_id' => $parameterId]);
        $primaryResult = $primaryQuery -> toList();

        foreach ($primaryResult as $row) {
            $data = array();
            $secondaryQuery = $this -> parameterTable -> find() -> where(['parent_id' => $row['parameter_id']]);
            $secondaryResult = $secondaryQuery -> toList();

            foreach ($secondaryResult as $col) {
                if ($edit) {
                    array_push($data, array('label' => $col['name'], 'value' => $col['parameter_id']));
                } else {
                    $data[ $col['name'] ] = $col['parameter_id'];
                }
            }

            if ($edit) {
                array_push($ret['first_level'], array('label' => $row['name'], 'value' => $row['parameter_id']));
                $ret['second_level'][ $row['parameter_id'] ] = $data;
            } else {
                $ret[ $row['name'] ] = $data;
            }
        }

        return $ret;
    }

    //获取其他选项信息
    private function _getOtherList ($parameterId, $edit = false) {
        $ret = array();

        $query = $this -> parameterTable -> find() -> where(['parent_id' => $parameterId]);
        $result = $query -> toList();

        foreach ($result as $row) {
            if ($edit) {
                array_push($ret ,array('label' => $row['name'], 'value' => $row['parameter_id']));
            } else {
                $ret[ $row['name'] ] = $row['parameter_id'];
            }
        }

        return $ret;
    }
}