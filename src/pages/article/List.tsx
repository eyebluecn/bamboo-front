import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import './List.less';
import BambooComponent from '../../common/component/BambooComponent';
import SortDirection from '../../common/model/base/SortDirection';
import Pager from '../../common/model/base/Pager';
import Article from '../../common/model/article/Article';
import Table, { ColumnProps } from 'antd/lib/table';
import StringUtil from '../../common/util/StringUtil';
import { Button, Icon, message as MessageBox, Popconfirm } from 'antd';
import DateUtil from '../../common/util/DateUtil';
import FilterPanel from '../widget/filter/FilterPanel';
import TableEmpty from '../widget/TableEmpty';
import Sun from '../../common/model/global/Sun';
import BambooTitle from '../widget/BambooTitle';


interface IProps extends RouteComponentProps {

}

interface IState {

}


export default class List extends BambooComponent<IProps, IState> {

  //获取分页的一个帮助器
  pager: Pager<Article> = new Pager<Article>(this, Article, 10);

  constructor(props: IProps) {
    super(props);


    this.state = {};
  }


  componentDidMount() {

    //刷新一下列表
    let that = this;

    that.pager.enableHistory();

    that.refresh();
  }

  search() {
    let that = this;
    that.pager.page = 0;
    that.refresh();
  }

  refresh() {

    let that = this;

    //如果没有任何的排序，默认使用时间倒序
    if (!that.pager.getCurrentSortFilter()) {
      that.pager.setFilterValue('orderCreateTime', SortDirection.DESC);
    }

    that.pager.httpList();
  }

  createArticle() {

    let that = this;


    //router中传入的路由相关对象
    let match = this.props.match;


    let url: string = StringUtil.prePath(match.path) + `/create`;

    Sun.navigateTo(url);
  }

  render() {

    let that = this;

    //router中传入的路由相关对象
    let match = this.props.match;

    //pager对象
    let pager = this.pager;

    const columns: ColumnProps<Article>[] = [{
      title: '文章名称',
      dataIndex: 'title',
      render: (text: any, record: Article, index: number): React.ReactNode => (
        <Link to={StringUtil.prePath(match.path) + '/detail/' + record.uuid}>{record.title}</Link>
      ),
    }, {
      title: '路径',
      dataIndex: 'path',
    }, {
      title: '作者',
      dataIndex: 'author',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      sortOrder: pager.getDefaultSortOrder('createTime'),
      sortDirections: [SortDirection.DESCEND, SortDirection.ASCEND],
      render: (text: any, record: Article, index: number): React.ReactNode => (
        DateUtil.simpleDateTime(text)
      ),
    }, {
      title: '修改时间',
      dataIndex: 'updateTime',
      sorter: true,
      sortOrder: pager.getDefaultSortOrder('updateTime'),
      sortDirections: [SortDirection.DESCEND, SortDirection.ASCEND],
      render: (text: any, record: Article, index: number): React.ReactNode => (
        DateUtil.simpleDateTime(text)
      ),
    }, {
      title: '操作',
      dataIndex: 'action',
      render: (text: any, record: Article) => (
        <span>

          <Link title="编辑"
                to={StringUtil.prePath(match.path) + '/edit/' + record.uuid}>
            <Icon className='btn-action' type="edit"/>
          </Link>

          <Popconfirm title="确认删除该文章，删除后不可恢复?" onConfirm={(e: any) => {
            record.httpDel(function() {
              MessageBox.success('删除成功！');
              that.refresh();
            });
          }} okText="确认" cancelText="取消">
            <Icon title="编辑" className="btn-action text-danger" type="delete"/>
          </Popconfirm>
        </span>
      ),
    }];

    return (
      <div className="article-list">

        <BambooTitle name={'文章管理'}>
          <Button type="primary" icon="plus" onClick={this.createArticle.bind(this)}>
            新建文章
          </Button>
        </BambooTitle>


        <div>
          <FilterPanel filters={pager.filters} onChange={this.search.bind(this)}/>
        </div>
        <Table
          rowKey="id"
          loading={pager.loading}
          dataSource={pager.data}
          columns={columns}
          pagination={pager.getPagination()}
          onChange={pager.tableOnChange.bind(pager)}
          locale={{ emptyText: (<TableEmpty pager={pager} onRefresh={this.refresh.bind(this)}/>) }}
        />
      </div>
    );
  }
}


