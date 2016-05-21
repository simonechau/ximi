<?php
/**
 * Created by PhpStorm.
 * User: simonezhou
 * Date: 2016/5/10
 * Time: 13:26
 */

namespace App\Controller;

use Cake\Core\Configure;
use Cake\ORM\TableRegistry;
use Cake\I18n\Date;

class ReportController extends BaseController
{
    private $accountTable;
    private $parameterTable;

    //expense
    public $firstItemId;
    public $firstItem = array('id' => array(), 'name' => array(), 'data' => array());
    public $secondItem = array('id' => array(), 'name' => array(), 'data' => array());
    public $member = array('id' => array(), 'name' => array(), 'data' => array());
    public $method = array('id' => array(), 'name' => array(), 'data' => array());
    public $seller = array('id' => array(), 'name' => array(), 'data' => array());

    //income
    public $incomeItem = array('id' => array(), 'name' => array(), 'data' => array());

    public function initialize()
    {
        parent::initialize(); // TODO: Change the autogenerated stub

        $this -> accountTable = TableRegistry::get('Account');
        $this -> parameterTable = TableRegistry::get('Parameter');
    }

    //初始化Compare页面Chart(api)
    public function getCompareChart() {
        $this -> autoRender = false;
        $ret = array('code' => 1, 'info' => '', 'data' => array());

        if ($this -> userState == Configure::read('LOGOUT_USER')) {
            $ret['code'] = 0;
            $ret['info'] = '已退出';
        } else if ($this -> request -> is('ajax')) {
            $ret['data']['expense_data'] = array();
            $ret['data']['income_data'] = array();

            for ($i = 2; $i <= 13; ++$i) {
                $now = Date::now();
                if ($i == 13) {
                    $startDate = $now -> year . '-' . ($i - 1) . '-01';
                    $endDate = ($now -> year + 1) . '-01-01';
                } else {
                    $startDate = $now -> year . '-' . ($i - 1) . '-01';
                    $endDate = $now -> year . '-' . $i . '-01';
                }

                $query = $this -> accountTable -> find();
                $query -> select([  'sum' => $query -> func() -> sum('sum'),
                    'classify_id' => 'classify_id'])
                    -> where([   'user_id' => $this -> userState,
                        'date >=' => new Date($startDate),
                        'date <' => new Date($endDate)  ])
                    -> group('classify_id');
                $result = $query -> toList();

                $sumData = array('expense_data' => 0, 'income_data' => 0);
                foreach ($result as $row) {
                    if ($row['classify_id'] == 1) {
                        $sumData['expense_data'] = $row['sum'];
                    } else {
                        $sumData['income_data'] = $row['sum'];
                    }
                }
                array_push($ret['data']['expense_data'], $sumData['expense_data']);
                array_push($ret['data']['income_data'], $sumData['income_data']);

            }
        }

        $this -> response -> body(json_encode($ret));
    }

    //初始化Expense_chart页面(api)
    public function getExpenseChart() {
        $this -> autoRender = false;
        $ret = array('code' => 1, 'info' => '', 'data' => array());

        if ($this -> userState == Configure::read('LOGOUT_USER')) {
            $ret['code'] = 0;
            $ret['info'] = '已退出';
        } else if ($this -> request -> is('ajax')) {
            $startDate = $this -> request -> data('startDate');
            $endDate = $this -> request -> data('endDate');

            //获取目录(id, name)
            $this -> _getFirstItemData($startDate, $endDate);
            $this -> firstItemId = $this -> firstItem['id'][0];
            $this -> _getData($this -> firstItemId, 'item', 'secondItem', $startDate, $endDate, Configure::read("EXPENSE_ACCOUNT"));
            $this -> _getData(Configure::read('Parameter.member'), 'member', 'member', $startDate, $endDate, Configure::read("EXPENSE_ACCOUNT"));
            $this -> _getData(Configure::read('Parameter.seller'), 'seller', 'seller', $startDate, $endDate, Configure::read("EXPENSE_ACCOUNT"));
            $this -> _getData(Configure::read('Parameter.method'), 'method', 'method', $startDate, $endDate, Configure::read("EXPENSE_ACCOUNT"));

            //对饼图数据特殊处理
            $this -> secondItem['data'] = $this -> _makePieData('secondItem');
            $this -> member['data'] = $this -> _makePieData('member');

            $ret['data']['firstItem']['name'] = $this -> firstItem['name'];
            $ret['data']['firstItem']['id'] = $this -> firstItem['id'];
            $ret['data']['firstItem']['data'] = $this -> firstItem['data'];
            $ret['data']['firstItemId'] = $this -> firstItemId;
            $ret['data']['secondItem'] = $this -> secondItem['data'];
            $ret['data']['member'] = $this -> member['data'];
            $ret['data']['seller']['name'] = $this -> seller['name'];
            $ret['data']['seller']['data'] = $this -> seller['data'];
            $ret['data']['method']['name'] = $this -> method['name'];
            $ret['data']['method']['data'] = $this -> method['data'];
        }

        $this -> response -> body(json_encode($ret));
    }

    //初始化Income_chart页面(api)
    public function getIncomeChart() {
        $this -> autoRender = false;
        $ret = array('code' => 1, 'info' => '', 'data' => array());

        if ($this -> userState == Configure::read('LOGOUT_USER')) {
            $ret['code'] = 0;
            $ret['info'] = '已退出';
        } else if ($this -> request -> is('ajax')) {
            $startDate = $this -> request -> data('startDate');
            $endDate = $this -> request -> data('endDate');

            //获取目录(id, name)
            $this -> _getData(Configure::read('Parameter.income_item'), 'item', 'incomeItem', $startDate, $endDate, Configure::read("INCOME_ACCOUNT"));
            $this -> _getData(Configure::read('Parameter.member'), 'member', 'member', $startDate, $endDate, Configure::read("INCOME_ACCOUNT"));
            $this -> _getData(Configure::read('Parameter.method'), 'method', 'method', $startDate, $endDate, Configure::read("INCOME_ACCOUNT"));

            //对饼图数据特殊处理
            $this -> member['data'] = $this -> _makePieData('member');

            $ret['data']['item']['name'] = $this -> incomeItem['name'];
            $ret['data']['item']['id'] = $this -> incomeItem['id'];
            $ret['data']['item']['data'] = $this -> incomeItem['data'];
            $ret['data']['member'] = $this -> member['data'];
            $ret['data']['method']['name'] = $this -> method['name'];
            $ret['data']['method']['data'] = $this -> method['data'];
        }

        $this -> response -> body(json_encode($ret));
    }

    //生成一级菜单柱状图(api)
    public function showFirstItemChart() {
        $this -> autoRender = false;
        $ret = array('code' => 1, 'info' => '', 'data' => array());

        if ($this -> userState == Configure::read('LOGOUT_USER')) {
            $ret['code'] = 0;
            $ret['info'] = '已退出';
        } else if ($this -> request -> is('ajax')) {
            $startDate = $this -> request -> data('startDate');
            $endDate = $this -> request -> data('endDate');

            $this -> _getFirstItemData($startDate, $endDate);
            $ret['data']['name'] = $this -> firstItem['name'];
            $ret['data']['data'] = $this -> firstItem['data'];
            $ret['data']['id'] = $this -> firstItem['id'];
        }

        $this -> response -> body(json_encode($ret));
    }

    //生成二级菜单柱状图(api)
    public function showSecondItemChart() {
        $this -> autoRender = false;
        $ret = array('code' => 1, 'info' => '', 'data' => array());

        if ($this -> userState == Configure::read('LOGOUT_USER')) {
            $ret['code'] = 0;
            $ret['info'] = '已退出';
        } else if ($this -> request -> is('ajax')) {
            $startDate = $this -> request -> data('startDate');
            $endDate = $this -> request -> data('endDate');
            $classifyId = $this -> request -> data('classifyId');

            $this -> firstItemId = $this -> request -> data('firstItemId');
            $this -> _getData($this -> firstItemId, 'item', 'secondItem', $startDate, $endDate, $classifyId);
            $ret['data']['name'] = $this -> secondItem['name'];
            $ret['data']['data'] = $this -> secondItem['data'];

            //特殊处理pie图
            $this -> secondItem['data'] = $this -> _makePieData('secondItem');
            $ret['data'] = $this -> secondItem['data'];
        }

        $this -> response -> body(json_encode($ret));
    }

    //生成Income菜单柱状图(api)
    public function showIncomeItemChart() {
        $this -> autoRender = false;
        $ret = array('code' => 1, 'info' => '', 'data' => array());

        if ($this -> userState == Configure::read('LOGOUT_USER')) {
            $ret['code'] = 0;
            $ret['info'] = '已退出';
        } else if ($this -> request -> is('ajax')) {
            $startDate = $this -> request -> data('startDate');
            $endDate = $this -> request -> data('endDate');
            $classifyId = $this -> request -> data('classifyId');

            $this -> _getData(Configure::read('Parameter.income_item'), 'item', 'incomeItem', $startDate, $endDate, $classifyId);
            $ret['data']['name'] = $this -> incomeItem['name'];
            $ret['data']['data'] = $this -> incomeItem['data'];
            $ret['data']['id'] = $this -> incomeItem['id'];
        }

        $this -> response -> body(json_encode($ret));
    }

    //生成成员饼图(api)
    public function showMemberChart() {
        $this -> autoRender = false;
        $ret = array('code' => 1, 'info' => '', 'data' => array());

        if ($this -> userState == Configure::read('LOGOUT_USER')) {
            $ret['code'] = 0;
            $ret['info'] = '已退出';
        } else if ($this -> request -> is('ajax')) {
            $startDate = $this -> request -> data('startDate');
            $endDate = $this -> request -> data('endDate');
            $classifyId = $this -> request -> data('classifyId');

            $this -> _getData(Configure::read('Parameter.member'), 'member', 'member', $startDate, $endDate, $classifyId);
            $this -> member['data'] = $this -> _makePieData('member');
        }

        $ret['data'] = $this -> member['data'];

        $this -> response -> body(json_encode($ret));
    }

    //生成支付方式柱状图(api)
    public function showMethodChart() {
        $this -> autoRender = false;
        $ret = array('code' => 1, 'info' => '', 'data' => array());

        if ($this -> userState == Configure::read('LOGOUT_USER')) {
            $ret['code'] = 0;
            $ret['info'] = '已退出';
        } else if ($this -> request -> is('ajax')) {
            $startDate = $this -> request -> data('startDate');
            $endDate = $this -> request -> data('endDate');
            $classifyId = $this -> request -> data('classifyId');

            $this -> _getData(Configure::read('Parameter.method'), 'method', 'method', $startDate, $endDate, $classifyId);
            $ret['data']['name'] = $this -> method['name'];
            $ret['data']['data'] = $this -> method['data'];
        }

        $this -> response -> body(json_encode($ret));
    }

    //生成商家柱状图(api)
    public function showSellerChart() {
        $this -> autoRender = false;
        $ret = array('code' => 1, 'info' => '', 'data' => array());

        if ($this -> userState == Configure::read('LOGOUT_USER')) {
            $ret['code'] = 0;
            $ret['info'] = '已退出';
        } else if ($this -> request -> is('ajax')) {
            $startDate = $this -> request -> data('startDate');
            $endDate = $this -> request -> data('endDate');
            $classifyId = $this -> request -> data('classifyId');

            $this -> _getData(Configure::read('Parameter.seller'), 'seller', 'seller', $startDate, $endDate, $classifyId);
            $ret['data']['name'] = $this -> seller['name'];
            $ret['data']['data'] = $this -> seller['data'];
        }

        $this -> response -> body(json_encode($ret));
    }

    //对饼图数据特殊处理
    private function _makePieData($arrayName) {
        $ret = array();
        $maxI = 0;
        $max = $this -> {$arrayName}['data'][0];
        for ($i = 0; $i < count($this -> {$arrayName}['data']); ++$i) {
            $temp = array(  'name' => $this -> {$arrayName}['name'][$i],
                            'y' => $this -> {$arrayName}['data'][$i]);
            array_push($ret, $temp);

            if ($this -> {$arrayName}['data'][$i] > $max) {
                $max = $this -> {$arrayName}['data'][$i];
                $maxI = $i;
            }
        }

        $ret[$maxI]['sliced'] = true;
        $ret[$maxI]['selected'] = true;

        return $ret;
    }

    //生成一级菜单数据
    private function _getFirstItemData ($startDate, $endDate) {
        $ret = array();

        //获取一级菜单id, name
        $this -> _getData(Configure::read('Parameter.expense_item'), 'item', 'firstItem', $startDate, $endDate, Configure::read('EXPENSE_ACCOUNT'), false);

        //获取一级菜单data
        for ($i = 0; $i < count($this -> firstItem['id']); ++$i) {
            $parentId = $this -> firstItem['id'][$i];

            $query = $this -> parameterTable -> find() -> select('parameter_id')
                -> where(['parent_id' => $parentId]);
            $result = $query -> toList();

            $sum = 0;
            foreach ($result as $row) {
                $childId = $row['parameter_id'];

                $query = $this -> accountTable -> find()
                    -> where([  'user_id' => $this -> userState,
                        'classify_id' => Configure::read("EXPENSE_ACCOUNT"),
                        'date >=' => $startDate,
                        'date <=' => $endDate,
                        "item_id" => $childId    ]);
                $sum += $query -> sumOf('sum');
            }

            $this -> firstItem['data'][$i] = $sum;
        }

        return $ret;
    }

    //生成数据
    private function _getData($parameterId, $parameter, $arrayName, $startDate, $endDate, $classifyId, $firstData = true) {
        //获取id与name

        $query = $this -> parameterTable -> find()
            -> where(['parent_id' => $parameterId])
            -> order(['parameter_id' => 'ASC']);
        $result = $query -> toList();
        foreach ($result as $row) {
            array_push($this -> {$arrayName}['id'], $row['parameter_id']);
            array_push($this -> {$arrayName}['name'], $row['name']);
        }

        if ($firstData) {
            //获取data
            for ($i = 0; $i < count($this -> {$arrayName}['id']); ++$i) {
                $id = $this -> {$arrayName}['id'][$i];
                $query = $this -> accountTable -> find()
                    -> where([  'user_id' => $this -> userState,
                        'classify_id' => $classifyId,
                        'date >=' => $startDate,
                        'date <=' => $endDate,
                        "{$parameter}_id" => $id    ]);
                $sum = $query -> sumOf('sum');

                $this -> {$arrayName}['data'][$i] = $sum;
            }
        }
    }
}